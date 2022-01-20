'use strict';

const uuidv5 = require('uuid/v5');

// The namespace for generating v5 UUIDs.
const UUID_NAMESPACE = uuidv5.URL;

/**
 * Generates a new UUID. The same UUID will be generated for the same seed, if the seed is specified.
 *
 * @param {String} [seed]
 * @returns {UUID}
 */
module.exports = function(seed) {
  return uuidv5(seed, UUID_NAMESPACE);
};
