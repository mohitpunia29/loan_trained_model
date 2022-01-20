const _ = require('lodash');
const Busboy = require('busboy');
const contentRangeParser = require('content-range');
const fs = require('fs');
const isType = require('type-is');
const mkdirp = require('mkdirp');
const path = require('path');
const Promise = require('bluebird');

const ERRORS = require('../constants/errors');
const vaultConfig = require('../config').vault;

// This is not implemented, so you might be disappointed when setting it to true :/
let ALLOW_MULTIPLE_FILES_UPLOAD = false;

Promise.promisifyAll(fs);
const mkdirpAsync = Promise.promisify(mkdirp);

/**
 * Returns the middleware function
 *
 * @see module.exports documentation
 * @return {Function}
 */
function middleware(originalOptions) {
  return function(req, res, next) {
    // expose options to the scope of the middleware
    const options = _.clone(originalOptions);

    const safeGuardSubFolder = req.params.sessionId;

    const FILE_ID = req.params.id;

    // only parse multipart form and if it has not been parsed already
    if (!isType(req, ['multipart']) || _.isArray(req.files)) return next();

    // eslint-disable-next-line complexity
    return new Promise(async function(resolve, reject) {
      const files = {};
      const fields = {};

      let busboy;

      // store the file path, so that we can:
      // - track if some are still getting processed
      // - remove them if an error occurs
      const pendingFiles = [];
      let errorOccured = false; // used to terminate only once, if multiple errors occur at the same time

      // store the files in a session specific folder to avoid any conflicts
      options.destination = path.join(options.destination, safeGuardSubFolder);

      // make sure the directory exists
      await mkdirpAsync(options.destination);

      const IS_RESUME_UPLOAD = !_.isFunction(options.isResume) ? false : options.isResume(req);

      const TMP_PATH = path.join(options.destination, FILE_ID);

      let stats;

      const contentRange = contentRangeParser.parse(req.header('content-range'));
      if (contentRange && (!_.has(contentRange, 'length') || Number.isNaN(contentRange.length))) {
        return abortWithReason('CONTENT_RANGE_LENGTH_INVALID');
      }

      if (IS_RESUME_UPLOAD && !contentRange) {
        return abortWithReason('RESUME_REQUIRES_CONTENT_RANGE');
      }

      // Cannot upload multiple files if partially uploading
      // because we cannot tell which file is a partial upload
      if (IS_RESUME_UPLOAD) {
        ALLOW_MULTIPLE_FILES_UPLOAD = false;

        // if resuming the upload
        // the file should exist
        try {
          stats = await fs.statAsync(TMP_PATH);
        } catch (e) {
          if (e.code === 'ENOENT') {
            // extra detailed error if uploaded the first byte, to tell the client how to use the APIs
            // eslint-disable-next-line max-depth
            if (contentRange.first === 0) {
              return abortWithReason('USE_POST_FOR_INITIAL_UPLOAD');
            }

            return abortWithReason('RESUME_FILE_NOT_FOUND');
          }

          return abortWithError(e);
        }

        // if so, the user is just trying to know what was the last byte uploaded to resume
        // and is actually not uploaded the file
        // so we return early to send the progress back
        // content-range: */[*|[file number of bytes]]
        if (req.header('content-length') === '0' &&
          contentRange.first === null && contentRange.last === null) {
          files[FILE_ID] = {
            size       : stats.size,
            isInitial  : !IS_RESUME_UPLOAD,
            isPartial  : true,
            isLastChunk: false
          };

          return finish();
        }

        if (contentRange.first !== stats.size) {
          return abortWithReason('WRONG_FIRST_BYTE');
        }
      }

      // Create the file if not exist, to make sure it actually does exist
      // In case the first POST request does not send any byte
      try {
        const fd = await fs.openAsync(TMP_PATH, 'wx');
        await fs.closeAsync(fd);
      } catch (e) {
        if (e.code !== 'EEXIST') {
          throw e;
        }
      }

      // busboy needs to be declared at the top to avoid: Uncaught ReferenceError: busboy is not defined
      // eslint-disable-next-line prefer-const
      busboy = new Busboy({
        headers     : req.headers,
        limits      : options.limits,
        preservePath: options.preservePath
      });

      // handle formData fields data
      busboy.on('field', function(fieldname, value) {
        if (/\[\]/.test(fieldname)) {
          // array with this format:
          // summary[] = 'First sentence'
          // summary[] = 'Second sentence'
          fieldname = fieldname.replace('[]', '');
          if (!fields[fieldname]) {
            fields[fieldname] = [];
          }

          fields[fieldname].push(value);
        } else if (fields[fieldname]) {
          // array with this format:
          // summary = 'First sentence'
          // summary = 'Second sentence'
          if (!_.isArray(fields[fieldname])) {
            fields[fieldname] = [fields[fieldname]];
          }

          fields[fieldname].push(value);
        } else {
          // normal fields
          _.set(fields, fieldname, value);
        }
      });

      // handle file
      busboy.on('file', async function(fieldname, fileStream, filename, encoding, mimetype) {
        if (ALLOW_MULTIPLE_FILES_UPLOAD === false && pendingFiles.length !== 0) {
          if (contentRange) return abortWithReason('NO_MULTIPLE_UPLOADS_WITH_CONTENT_RANGE');

          return abortWithReason('LIMIT_FILE_COUNT');
        }

        // don't attach to the files object, if there is no file
        if (!filename) return fileStream.resume();

        // initialize the values for a one time upload
        let isPartial = false;
        let isLastChunk = true;

        if (contentRange) {
          if (contentRange.last !== contentRange.length - 1) {
            isLastChunk = false;
          }
          // if start is not 0: it's a resume
          // if start is 0, but it does not upload until the last byte of the file
          if (contentRange.first !== 0 || (contentRange.first === 0 && !isLastChunk)) {
            isPartial = true;
          }
        }

        const file = {
          filename    : filename,
          path        : TMP_PATH,
          encoding    : encoding,
          mimetype    : mimetype,
          isInitial   : !IS_RESUME_UPLOAD,
          isPartial   : isPartial,
          isLastChunk : isLastChunk,
          contentRange: contentRange
        };

        files[FILE_ID] = file;

        // We made sure that the file always exist before reaching this part
        const writeStream = fs.createWriteStream(TMP_PATH, { flags: 'a' });

        // listen on writeStream instead of fileStream
        // because fileStream receives 'end', before all the bytes are piped to the writeStream
        // and therefore before they are persisted on the disk
        writeStream.on('close', async function() {
          const finalStats = await fs.statAsync(TMP_PATH);
          file.size = finalStats.size;

          _.pull(pendingFiles, TMP_PATH);

          finish();
        });

        pendingFiles.push(TMP_PATH);
        fileStream.pipe(writeStream);
      });

      busboy.on('error', abortWithError);
      busboy.on('partsLimit', abortWithReason.bind(null, 'LIMIT_PART_COUNT'));
      busboy.on('filesLimit', abortWithReason.bind(null, 'LIMIT_FILE_COUNT'));
      busboy.on('fieldsLimit', abortWithReason.bind(null, 'LIMIT_FIELD_COUNT'));
      busboy.on('finish', finish);

      /**
       * Called when a file upload is done
       * Checks if all the pending actions are finished
       * Before resolving the promise
       */
      function finish() {
        if (pendingFiles.length !== 0) return;

        detachBusboy();

        req.files = _.values(files);
        // if no file was uploaded
        // defaults the data
        if (req.files.length === 0) {
          req.files = [{
            path       : TMP_PATH,
            size       : 0,
            isInitial  : !IS_RESUME_UPLOAD,
            isPartial  : true,
            isLastChunk: false
          }];
        }
        req.body = _.defaults({
          id: FILE_ID // assign at the end, so it does not conflict with the fields parser
        }, fields);

        resolve();
      }

      // Start the parsing
      req.pipe(busboy);

      /**
       * Called when an error occurs
       * Stop all the uploads and rejects the promise
       *
       * @param  {Error} uploadError - the error that occured
       * @throws
       */
      async function abortWithError(uploadError) {
        if (errorOccured) return;
        errorOccured = true;

        detachBusboy();

        if (!IS_RESUME_UPLOAD) {
          await removeUploadedFiles();
        }

        req.files = [];
        req.body = {};

        return reject(uploadError);
      }

      /**
       * Remove all the temporary files used during the upload process
       */
      async function removeUploadedFiles() {
        return Promise.map(pendingFiles, fs.unlinkAsync);
      }

      /**
       * Sugar function to create an error from a predefined reason
       *
       * @param  {String} reason
       * @throws
       */
      function abortWithReason(reason) {
        abortWithError(createError(reason));
      }

      /**
       * Detach busboy if exists
       * and drains all remaining streams
       */
      function detachBusboy() {
        if (busboy) {
          req.unpipe(busboy);
          busboy.removeAllListeners();
        }
        drainStream(req);
      }
    })
      .then(next.bind(null, null)) // was not able to get asCallback to work
      .catch(next);
  };
}

/**
 * Drains any stream
 *
 * @param  {Stream} stream
 */
function drainStream(stream) {
  stream.on('readable', stream.read.bind(stream));
}

/**
 * Create an error from predefined reasons
 *
 * @param  {String} reason
 * @param  {String} message
 * @return {Error}
 */
function createError(reason, message) {
  if (!ERRORS.CreateFile[reason]) {
    throw new Error('Mamma mia, this error does not exist');
  }

  return new ERRORS.CreateFile[reason](message);
}

/**
 * Function to instantiate the middleware
 *
 * @param  {Object} [options={}]
 * @param  {Object} [options.limits] - Various limits on incoming data,
 *                                     @see https://github.com/mscdex/busboy#busboy-methods
 * @param  {Object} [options.preservePath=false] - If paths in the multipart 'filename' field shall be preserved.
 * @param  {Object} [options.destination] - Absolute path to the folder in which to save the files
 * @return {Function}
 */
module.exports = function(options = {}) {
  if (!options || !_.isObject(options)) {
    throw new Error('options should be an object');
  }

  options = _.defaultsDeep(options, {
    limits      : options.limits || {},
    preservePath: Boolean(options.preservePath),
    destination : options.destination || vaultConfig.tmpFolder
  });

  return middleware(options);
};
