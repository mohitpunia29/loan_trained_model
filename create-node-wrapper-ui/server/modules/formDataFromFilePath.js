const _ = require('lodash');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Create a formData object from a filePath
 *
 * @param {Object} fileObj              - Object containing information for the file
 * @param {Object} [fileObj.key='file'] - Key to use for the file
 * @param {Object} fileObj.filePath     - path to the file on the fileSystem
 * @param {Object} [fields={}]          - additional fields
 * @return {FormData}
 */
module.exports = function(fileObj, fields = {}) {
  if (_.isEmpty(fileObj)) {
    throw new Error('Parameter fileObj cannot be empty');
  }
  if (!fileObj.filePath) {
    throw new Error('Parameter fileObj.filePath is required');
  }

  if (!fileObj.key) {
    fileObj.key = 'file';
  }
  const form = new FormData();
  form.append(fileObj.key, fs.createReadStream(fileObj.filePath));

  _.forEach(fields, function(value, key) {
    form.append(key, value);
  });

  return form;
};
