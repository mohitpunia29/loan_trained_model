'use strict';

const _ = require('lodash');
const request = require('request');

const convertCsvToJson = require('./modules/convertCsvToJson');
const generateCSVSchema = require('../getCsvSchema/modules/generateCSVSchema');
const parseCsv = require('../getCsvSchema/modules/parseCsv');
const stringToStream = require('../../../modules/stringToStream');

module.exports = async function(req, res, next) {
  const { url, csv, fromLine, lineCount, delimiter } = req.body;
  let { fields } = req.body;

  const sourceStream = getStream();

  try {
    let headers;
    if (!fields) {
      let rowsOfData;
      ({ headers, rowsOfData } = await parseCsv(sourceStream));
      if (url) {
        sourceStream.abort();
      }

      fields = generateCSVSchema(headers, rowsOfData);
    } else {
      headers = _.map(fields, 'name');
    }

    res.setHeader('Content-type', 'application/json');
    res.setHeader('Content-disposition', 'attachment; filename=data.json');

    const stream = getStream();

    convertCsvToJson({ fields, headers, fromLine, lineCount, delimiter })(stream, next)
      .on('error', next)
      .pipe(res);
  } catch (e) {
    if (url) {
      sourceStream.abort();
    }

    return next(e);
  }

  function getStream() {
    if (url) {
      return request({
        uri   : url,
        method: 'GET'
      })
        .on('error', next);
    }
    if (csv) {
      return stringToStream(csv);
    }

    return next(new Error('No url/csv provided'));
  }
};
