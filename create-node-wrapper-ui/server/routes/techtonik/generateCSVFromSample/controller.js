'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const uuid = require('uuid/v4');

const createSortedSampleFile = require('../../csv/modules/createSortedSampleFile');
const extractCsvSections = require('../../csv/modules/extractCsvSections');
const getSampleFilePathForSort = require('../../csv/modules/getSampleFilePathForSort');
const mergeRanges = require('../../csv/modules/mergeRanges');

const { SAMPLE_FILE_FOLDER_PATH } = require('../../csv/constants/sample');
const FILENAME = 'sample.csv';

const MODES = {
  RANDOM     : 'random',
  SEQUENTIAL : 'sequential',
  CHERRY_PICK: 'cherry-pick'
};

module.exports = async function(req, res, next) {
  generateCsv(req, res, next);
};

async function generateCsv(req, res, cb) {
  let ranges, sortColumn, sortDirection, sortType;

  try {
    ({ ranges, sortColumn, sortDirection, sortType } = validateAndExtractParams(req));
  } catch (e) {
    return cb(e);
  }

  // console.log('after parse', JSON.stringify(ranges, false, 2));
  const sourceFile = path.join(SAMPLE_FILE_FOLDER_PATH, FILENAME);
  const destinationFile = getSampleFilePathForSort({
    filename: FILENAME,
    sortColumn,
    sortDirection,
    sortType
  });
  try {
    await createSortedSampleFile({ sourceFile, destinationFile, sortColumn, sortDirection, sortType });
  } catch (e) {
    return cb(e);
  }

  // we want to generate a new CSV, so we need to copy the headers
  // in addition to the rows the user wants
  ranges.unshift([0]);

  ranges = mergeRanges(ranges);

  // console.log('after merge', JSON.stringify({ ranges }, false, 2));

  const salt = uuid();
  const NEW_NAME = `sample_${salt}.csv`;

  const readStream = new Readable({
    read() {}
  });

  // begin piping our result to the response
  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-disposition', `attachment; filename="${NEW_NAME}"`);
  readStream.pipe(res);

  const file = fs.createReadStream(sourceFile);

  extractCsvSections(ranges, readStream)(file, cb);
};

/**
 * Validate the request params and format `ranges`
 *
 * @param  {Request} req
 * @param  {Object}  req.query
 * @param  {String}  req.query.mode
 * @param  {Array}   req.query.range
 * @param  {Number}  req.query.fromLine
 * @param  {Number}  req.query.lineCount
 * @param  {String}  req.query.sortColumn
 * @param  {String}  req.query.sortDirection
 * @param  {String}  req.query.sortType
 * @return {Object} { ranges }
 */
function validateAndExtractParams(req) {
  let { mode, sortColumn, sortDirection, sortType } = req.query;
  let { range: ranges } = req.query;

  // Only cherry-pick uses range
  if (ranges && !mode) {
    mode = MODES.CHERRY_PICK;
  }

  if (mode === MODES.CHERRY_PICK) {
    if (_.isString(ranges)) {
      ranges = [ranges];
    }

    ranges = _.map(ranges, function(range) {
      const match = range.match(/\[([0-9]+)(?:.(?:\s+)?([0-9]+))?\]/);

      if (!match) {
        return throwInvalidRange(range);
      }

      const sanitizedRange = _([parseInt(match[1]), parseInt(match[2])])
        // remove null/undefined/NaN values
        .filter(_.isFinite)
        // increase by one to skip headers line
        .map(function(val) {
          return val + 1;
        })
        .value();

      // Make sure the range is in correct order
      const [min, max] = sanitizedRange;
      if (_.isFinite(max) && min > max) {
        return throwInvalidRange(range);
      }

      return sanitizedRange;
    })
  } else {
    ranges = [];
  }

  let lineCount = parseInt(req.query.lineCount || 100);

  const fromLine = mode === MODES.RANDOM ? _.random(0, 3549 - lineCount) : 0;

  if (fromLine === 0) {
    lineCount += 1;
  }

  if (ranges.length === 0 && mode === MODES.CHERRY_PICK) {
    const err = new Error(`Parameter ranges is required for '${MODES.CHERRY_PICK}' mode`);
    err.statusCode = 404;
    err.code = '0000006';
    err.reason = 'INVALID_PARAMETER';

    throw err;
  }

  if (mode !== MODES.CHERRY_PICK) {
    ranges = [[fromLine, fromLine + lineCount]];
  }

  if (sortDirection) {
    if (!_.includes(['asc', 'desc'], sortDirection)) {
      return throwInvalidParameter('sortDirection');
    }
  } else {
    sortDirection = 'asc';
  }

  if (sortType) {
    if (!_.includes(['alphanumeric', 'numeric', 'date'], sortType)) {
      return throwInvalidParameter('sortType');
    }
  } else {
    sortType = 'alphanumeric';
  }

  return { ranges, sortColumn, sortDirection, sortType };
}

function throwInvalidRange(range) {
  const err = new Error('Invalid range: ' + range);
  err.statusCode = 400;
  err.code = '0000006';
  err.reason = 'INVALID_PARAMETER';

  throw err;
}
