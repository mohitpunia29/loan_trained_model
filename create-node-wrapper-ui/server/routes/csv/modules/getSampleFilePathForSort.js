const path = require('path');

const getSampleFileNameForSort = require('./getSampleFileNameForSort');

const { SAMPLE_FILE_FOLDER_PATH } = require('../constants/sample');

/**
 * Return the filePath of the sample file to use based on the column to sort by
 *
 * @param  {String} filename
 * @param  {String} [sortColumn]
 * @param  {String} [sortDirection]
 * @param  {String} [sortType]
 * @return {String}
 */
module.exports = function({ filename, sortColumn, sortDirection, sortType }) {
  let sourceFile = filename;
  if (sortColumn) {
    sourceFile = path.resolve(SAMPLE_FILE_FOLDER_PATH, getSampleFileNameForSort(filename, sortColumn, sortDirection, sortType));
  }

  return sourceFile;
};
