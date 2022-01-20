const _ = require('lodash');
const express = require('express');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');
const router = express.Router();

const buildPath = require('../../modules/buildPath');
const config = require('../../config');
const doesFileExist = require('../../modules/doesFileExist');
const errorsConstants = require('../../constants/errors');
const { multipart } = require('../../middlewares');
const moveFile = require('../../modules/moveFile');
const unlinkFile = require('../../modules/unlinkFile');
const extractThumbnailIfAppropriate = require('../../modules/extractThumbnailIfAppropriate');
const updateDb = require('./updateDb');

const mkdirpAsync = Promise.promisify(mkdirp);

const { sendResponse } = require('../../middlewares');

router.use('/:sessionId/:id', multipart({
  destination: config.upload.tmpFolder
}));

router.post('/:sessionId/:id', async function(req, res, next) {
  const uploadedFile = _.get(req, 'files[0]');

  const DESTINATION_FOLDER = buildPath(req.params.sessionId);
  const FINAL_FILE_PATH = buildPath(req.params.sessionId, req.params.id);

  try {
    // make sure the directory exists
    await mkdirpAsync(DESTINATION_FOLDER);

    const fileExists = await doesFileExist(FINAL_FILE_PATH);
    if (fileExists) {
      // delete the file from tmp and throw
      await unlinkFile(uploadedFile.path);
      throw new errorsConstants.CreateFile.FILE_EXISTS();
    }

    // move the file from tmp to the its final destination
    await moveFile(uploadedFile.path, FINAL_FILE_PATH);

    const thumbnail = await extractThumbnailIfAppropriate({
      fileName       : uploadedFile.filename,
      fileId         : req.params.id,
      filePath       : FINAL_FILE_PATH,
      thumbnailFolder: DESTINATION_FOLDER
    });

    await updateDb({
      thumbnail,
      id       : req.params.id,
      sessionId: req.params.sessionId,
      fileName : uploadedFile.filename
    });

    sendResponse({
      responsePayload: {
        id       : req.params.id,
        sessionId: req.params.sessionId,
        name     : uploadedFile.filename,
        thumbnail
      }
    }, res);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
