const fs = require('fs');
const Promise = require('bluebird');

const debug = require('debug')('modules/moveFile');

Promise.promisifyAll(fs);

/**
 * Move a local file to the final folder
 *
 * @param {String} currentPath
 * @param {String} finalPath
 */
module.exports = async function(currentPath, finalPath) {
  debug('Moving file: %s to %s', currentPath, finalPath);

  try {
    await fs.renameAsync(currentPath, finalPath);
  } catch (e) {
    // if the file does not exist, for idempotency reason
    // check if it has not been move already
    if (e.code === 'ENOENT') {
      // if the file is not at the destination either
      // then just let fs throw the file does not exist error
      try {
        await fs.statAsync(finalPath);
      } catch (noFinalFileErr) {
        throw e; // throw the first error
      }
    } else {
      throw e;
    }
  }
};
