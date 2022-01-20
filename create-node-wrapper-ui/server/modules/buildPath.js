const path = require('path');

const config = require('../config');

/**
 * Build the path for a file in the file system
 *
 * @param {...String} args
 * @return {String}
 */
module.exports = function(...args) {
  return path.join(config.upload.finalFolder, ...args);
};
