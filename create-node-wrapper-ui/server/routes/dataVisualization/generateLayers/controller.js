'use strict';

const request = require('request');

const generateLayers = require('./modules/generateLayers');

const { sendResponse } = require('../../../middlewares');

module.exports = async function(req, res, next) {
  const { url, layers } = req.body;

  const stream = request({
    uri   : url,
    method: 'GET'
  })
    .on('error', next);

  generateLayers(layers)(stream, next)
    .on('layers', function(responsePayload) {
      sendResponse({ responsePayload }, res);
    })
    .on('error', next);
};
