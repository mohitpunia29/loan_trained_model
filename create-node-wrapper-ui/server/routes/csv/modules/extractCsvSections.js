'use strict';

const _ = require('lodash');
const splitStreamByLine = require('split');

/**
 * Transform a csv using the provided transform function
 *
 * @param  {Array}   ranges
 * @param  {Stream}  readableStream
 * @return {Function({Stream, Function})}
 */
module.exports = function(ranges, readableStream) {
  if (!_.isArray(ranges)) {
    throw new Error('Parameter ranges is required');
  }
  if (ranges.length === 0) {
    throw new Error('Parameter ranges cannot be empty');
  }

  return function(stream, next) {
    let currentRange;
    let index = -1; // we initialize at -1, so that we can increment index when entering the function and return early

    function onFinish() {
      readableStream.push(null);
    }

    return stream
      .on('end', onFinish)
      .on('close', onFinish)
      .pipe(splitStreamByLine(/\r?\n/))
      .on('error', next)
      .on('data', function(data) {
        // if we do not have any more range
        // we stop
        if (!currentRange && ranges.length === 0) {
          stream.destroy();
          return;
        }

        index++;

        // no range is active and the current index hasn't reached the next range
        if (!currentRange && index < ranges[0][0]) return;

        // there is no currentRange but we just reached the first value of the next one
        if (!currentRange && index === ranges[0][0]) {
          currentRange = ranges.shift();
        }

        // if we are still inside the currentRange
        if (index <= currentRange[1]) {
          // do not push data if it's empty
          // it means we reached the end of the file
          if (data) {
            readableStream.push(data + '\n');
          }
        }

        if (index >= currentRange[1]) {
          // we are outside of the currentRange
          currentRange = undefined;
        }
      })
      .on('error', next);
  };
};
