const _ = require('lodash');

/**
 * Takes an array of ranges and merge them
 *
 * @param  {Array} ranges
 * @return {Array}
 */
function mergeRanges(ranges) {
  ranges = _.sortBy(ranges, '0');
  const result = [];

  for (const range of ranges) {
    // make sure a range always has a min and max value
    // [12] => [12, 12]
    if (range.length === 1) {
      range.push(range[0]);
    }

    // first pass
    if (result.length === 0) {
      result.push(range);
      continue;
    }

    // if the min value of the range is inferior or equal to the max value of the current range
    if (range[0] <= result[result.length - 1][1] || // range: [1, 10], current: [8, 15]
      range[0] - 1 === result[result.length - 1][1]) { // merge adjoining ranges: [1, 3] and [4, 6] -> [1, 6]
      result[result.length - 1][1] = Math.max(result[result.length - 1][1], range[1]);
    } else {
      result.push(range);
    }
  }

  return result;
}

module.exports = mergeRanges;
