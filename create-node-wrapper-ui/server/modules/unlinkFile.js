const fs = require('fs');
const Promise = require('bluebird');

const debug = require('debug')('modules:unlinkFile');

Promise.promisifyAll(fs);

/**
 * Remove a file
 *
 * @param {String} filePath
 */
module.exports = async function(filePath) {
  debug('Unlinking file: %s', filePath);

  try {
    await fs.unlinkAsync(filePath);
  } catch (e) {
    // Do not throw an error if the file is already deleted (idempotency)
    // if different error, then throw
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
};
