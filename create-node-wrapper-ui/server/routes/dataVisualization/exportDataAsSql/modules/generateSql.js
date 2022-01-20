'use strict';

const transformCsv = require('../../modules/transformCsv');

/**
 *
 *
 * @return {Function}
 */
module.exports = function({ headers, fields }) {
  return transformCsv({ headers, fields, transform });
};

function transform({ headers, data }) {
  return `INSERT INTO myTable (${headers.join(', ')}) VALUES (${data.join(', ')});\n`;
}
