const _ = require('lodash');
const fs = require('fs').promises;

const { TECHNICAL_SUPPORT_CSV_FILE_PATH } = require('../../../config/technicalSupport');

const SEPARATOR = ',';

/**
 * Will save the mail to a CSV file
 *
 * @param  {Object} mailPayload
 * @return {Promise}
 */
module.exports = async function saveToCsv(mailPayload) {
  if (_.isEmpty(mailPayload)) {
    throw new Error('Parameter mailPayload is required');
  }

  let stats;
  try {
    stats = await fs.stat(TECHNICAL_SUPPORT_CSV_FILE_PATH);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;

    // if the file does not exist, we default the size to 0
    // so that we can have the same logic in the rest of the code
    stats = { size: 0 };
  }

  let contentToInsert = '';

  // unsure the order of the headers is respected
  const keys = Object.keys(mailPayload);

  // insert the headers row if the file is empty
  if (stats.size === 0) {
    contentToInsert += keys.join(SEPARATOR) + '\n';
  }
  // insert the mail payload
  contentToInsert += _.map(keys, function(key) {
    return `"${escapeString(mailPayload[key])}"`;
  }) + '\n';

  await fs.appendFile(TECHNICAL_SUPPORT_CSV_FILE_PATH, contentToInsert, 'utf8');
};

/**
 * We are double quoting the values in the CSV, so we have to escape them inside the strings
 * Also escape new lines
 *
 * @param  {String} string
 * @return {String}
 */
function escapeString(string) {
  return string
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}
