'use strict';

const parseCSV = require('csv-parse');
const splitStreamByLine = require('split');
const transform = require('stream-transform');

const castOverride = require('./cast');

/**
 * Transform a csv using the provided transform function
 *
 * @param  {Object}   args
 * @param  {Array}    args.headers
 * @param  {Object}   args.fields
 * @param  {Function} args.transform
 * @param  {Number}   [args.fromLine=1]
 * @param  {Number}   [args.lineCount]
 * @param  {String}   [args.delimiter=',']
 * @return {Function({Stream, Function})}
 */
module.exports = function({ headers, fields, transform: transformFn, fromLine = 1, lineCount, delimiter = ',' }) {
  return function(stream, next) {
    return stream
      .pipe(splitStreamByLine(/(\r?\n)/))
      .on('error', next)
      .pipe(parseCSV({
        // skip_empty_lines            : true, // it's buggy
        delimiter,
        skip_lines_with_empty_values: true,
        skip_lines_with_error       : true,
        from_line                   : fromLine + 2, // + 2 because of the header and the field is 1 based
        to                          : lineCount,
        trim                        : true,
        cast                        : (value, context) => {
          return castOverride(value, fields[context.index].type);
        }
      }))
      .on('error', next)
      // we have to use stream-transform, because csv-parse returns an array,
      // and the stream API works only with string/buffer
      .pipe(transform(function(data) {
        return transformFn({ headers, data });
      }))
      .on('error', next);
  };
};
