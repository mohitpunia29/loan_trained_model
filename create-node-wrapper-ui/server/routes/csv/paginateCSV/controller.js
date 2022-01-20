'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const createSortedSampleFile = require('../modules/createSortedSampleFile');
const extractCsvSections = require('../modules/extractCsvSections');
const getSampleFilePathForSort = require('../modules/getSampleFilePathForSort');
const mergeRanges = require('../modules/mergeRanges');

const { SAMPLE_FILE_FOLDER_PATH } = require('../constants/sample');

module.exports = function(req, res, next) {
  paginateCsv(req, res, next);
};

async function paginateCsv(req, res, cb) {
  const filename = `${req.params.filename}.csv`;
  let from, count, sortColumn, sortDirection, sortType;

  try {
    ({ from, count, sortColumn, sortDirection, sortType } = validateAndExtractParams(req));
  } catch (e) {
    return cb(e);
  }

  const sourceFile = path.resolve(SAMPLE_FILE_FOLDER_PATH, filename);
  try {
    await fs.promises.stat(sourceFile);
  } catch (e) {
    return cb(createNoDatasetError());
  }

  const destinationFile = getSampleFilePathForSort({ filename, sortColumn, sortDirection, sortType });
  try {
    await createSortedSampleFile({ sourceFile, destinationFile, sortColumn, sortDirection, sortType });
  } catch (e) {
    return cb(e);
  }

  const NEW_NAME = `sample_${from}-${from + count}.csv`;

  const readStream = new Readable({
    read() {}
  });

  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-disposition', `attachment; filename="${NEW_NAME}"`);
  readStream.pipe(res);

  const file = fs.createReadStream(sourceFile);

  // count - 1 => example: if count is 20, then range is [0, 19], not [0, 20]
  const ranges = mergeRanges([[0], [from, from + (count - 1)]]);

  extractCsvSections(ranges, readStream)(file, cb);
};

/**
 * Validate the request params and return them sanitized
 *
 * @param  {Request} req
 * @param  {Object}  req.query
 * @param  {Number}  req.query.start
 * @param  {Number}  req.query.count
 * @param  {String}  req.query.sortColumn
 * @param  {String}  req.query.sortDirection
 * @param  {String}  req.query.sortType
 * @return {Object}  { from, count, sortColumn, sortDirection, sortType }
 */
function validateAndExtractParams(req) {
  let { start, count, sortColumn, sortDirection, sortType } = req.query;

  if (!start) {
    return throwInvalidParameter('start');
  }
  if (!count) {
    return throwInvalidParameter('count');
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

  return {
    from : parseInt(start) + 1, // shift by 1, because the first row is the headers
    count: parseInt(count),
    sortColumn,
    sortDirection,
    sortType
  };
}

function throwInvalidParameter(paramName) {
  const err = new Error('Invalid parameter ' + paramName);
  err.statusCode = 400;
  err.code = '0000006';
  err.reason = 'INVALID_PARAMETER';

  throw err;
}

function createNoDatasetError() {
  const err = new Error('No dataset found');
  err.statusCode = 404;
  err.code = '0000003';
  err.reason = 'BAD_REQUEST';

  return err;
}
