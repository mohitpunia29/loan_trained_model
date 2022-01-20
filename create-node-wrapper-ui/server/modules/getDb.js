const low = require('lowdb');
const DB_PATH = require('../config/db').path;
const FileAsync = require('lowdb/adapters/FileAsync');

const DB_STRUCTURE = {
  sessions: {}
};

/**
 * Initializes the DB if necessary and returns a handle to access it.
 *
 * @return {Object}
 */
module.exports = async function getDb() {
  const adapter = new FileAsync(DB_PATH, {
    defaultValue: DB_STRUCTURE
  });

  return low(adapter);
};
