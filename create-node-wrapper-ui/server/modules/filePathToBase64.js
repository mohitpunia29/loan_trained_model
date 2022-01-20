const fs = require('fs');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

/**
 * function to encode file data to base64 encoded string
 *
 * @param {String} filePath
 * @param {String}
 */
module.exports = async function(filePath) {
  // read binary data
  const bitmap = await fs.readFileAsync(filePath);

  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
};
