const _ = require('lodash');

const SUPPORTED_FORMATS = require('../constants/supportedFileFormats');

/**
 * Get the type associated with a given fileName looking at its extension.
 *
 * @param {String} fileName
 */
module.exports = function getFileType(fileName) {
  if (_.isEmpty(fileName)) {
    return null;
  }

  // Get the file name extension
  const extension = fileName.substring(fileName.lastIndexOf('.') + 1);

  for (const typeObject of SUPPORTED_FORMATS) {
    if (_.includes(typeObject.extensions, extension)) {
      return typeObject.type;
    }
  }

  return null;
};
