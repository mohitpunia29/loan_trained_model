'use strict';

const through = require('through2');

const transformCsv = require('../../modules/transformCsv');

/**
 * Converts a csv to a json
 *
 * @param  {Object}   args
 * @param  {Array}    args.headers
 * @param  {Object}   args.fields
 * @param  {Number}   [args.fromLine]
 * @param  {Number}   [args.lineCount]
 * @param  {String}   [args.delimiter]
 * @return {Function}
 */
module.exports = function({ headers, fields, fromLine, lineCount, delimiter }) {
  return function(stream, next) {
    let isFirstChunk = true;

    return transformCsv({ headers, fields, transform, fromLine, lineCount, delimiter })(stream, next)
      .pipe(through(function(chunk, enc, callback) {
        if (isFirstChunk) {
          this.push('[');
          isFirstChunk = false;
        } else {
          this.push(',\n');
        }

        this.push(chunk);
        callback();
      }))
      .on('error', next)
      .on('end', function() {
        if (!isFirstChunk) {
          this.emit('data', ']');
        } else {
          // if we didn't get a first chunk, it means there is no data
          this.emit('data', '[]');
        }
      });
    };
};

function transform({ headers, data }) {
  const jsonRow = {};

  for (let i = 0; i < headers.length; i++) {
    jsonRow[headers[i]] = data[i];
  }

  return JSON.stringify(jsonRow, false, 2);
}
