const _ = require('lodash');
const express = require('express');
const mkdirp = require('mkdirp');
const Promise = require('bluebird');
const request = require('request');
const { createWriteStream } = require('fs');
const router = express.Router();

const buildPath = require('../../modules/buildPath');
const doesFileExist = require('../../modules/doesFileExist');
const errorsConstants = require('../../constants/errors');

const providersConfig = require('../../config/providers');
const providers = require('../../providers');

const { sendResponse } = require('../../middlewares');

const mkdirpAsync = Promise.promisify(mkdirp);

router.post('/:provider/:sessionId/:id', async function(req, res, next) {
  const { provider, sessionId, id } = req.params;
  const body = req.body;

  try {
    if (!_.includes(Object.keys(providersConfig), provider)) {
      throw new errorsConstants.Proxy.UNSUPPORTED_PROVIDER();
    }

    const FOLDER_PATH = buildPath(sessionId);
    const FILE_PATH = buildPath(sessionId, id);

    await mkdirpAsync(FOLDER_PATH);

    await new Promise(function(resolve, reject) {
      request.get(body.url)
        .on('error', reject)
        .on('response', function() {
          resolve();
        })
        .pipe(createWriteStream(FILE_PATH));
    });

    const fileExists = await doesFileExist(FILE_PATH);
    if (!fileExists) {
      throw new errorsConstants.Proxy.FILE_DOES_NOT_EXIST();
    }

    const providerInstance = new providers[provider]();

    await providerInstance.init();

    const response = await providerInstance.process({
      payload : body,
      filePath: FILE_PATH,
      sessionId,
      id
    });

    sendResponse({
      responsePayload: response
    }, res);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
