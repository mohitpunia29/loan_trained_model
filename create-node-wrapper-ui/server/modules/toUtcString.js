const moment = require('moment-timezone');

/**
 * Return a utc timestamp
 * If nothing is provided, returns the current one
 *
 * @param  {String} [timestamp]
 * @return {String}
 */
module.exports = function(timestamp) {
  if (timestamp === null) return null;

  return moment(timestamp)
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};
