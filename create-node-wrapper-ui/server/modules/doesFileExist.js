const fs = require('fs');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

/**
 * Check if the file exists
 * if it doesm, throw an error
 *
 * @param {String} filePath
 * @return {Boolean}
 */
module.exports = async function(filePath) {
  try {
    await fs.statAsync(filePath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
  }

  // unless we know the file does not exist, we assume it does
  return true;
};
