'use strict';

const request = require('request');

const { sendResponse } = require('../../../middlewares');
const getCSVSchema = require('./modules/generateCSVSchema');
const parseCsv = require('./modules/parseCsv');

module.exports = async function(req, res, next) {
  const { fileId, url } = req.body;
  const csvRequest = request({
    uri   : url,
    method: 'GET'
  });

  try {
    const { headers, rowsOfData } = await parseCsv(csvRequest);
    csvRequest.abort();

    sendResponse({
      responsePayload: {
        fileId,
        fields: getCSVSchema(headers, rowsOfData)
      }
    }, res);
  } catch (e) {
    csvRequest.abort();

    return next(e);
  }
};
