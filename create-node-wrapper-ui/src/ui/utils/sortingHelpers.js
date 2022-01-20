import {
  map as _map,
  mapValues as _mapValues,
  orderBy as _orderBy
} from 'lodash';

/**
 * Will try to position the file in the list if it belongs there
 *
 * @param  {Object} args
 * @param  {Object} args.list
 * @param  {Object} args.noMoreItems
 * @param  {Object} file
 * @param  {string} sort
 * @return {number}
 */
export function getFileIndex({ list, noMoreItems }, file, sort) {
  const indexToInsert = sortedIndexBy(list, file, vaultComparator[sort]);

  if (indexToInsert >= 0 && (indexToInsert < list.length || noMoreItems)) {
    return indexToInsert;
  }

  return -1;
}

/**
 * Sort a list
 *
 * @param  {Array} list
 * @param  {string} sort
 * @return {Array}
 */
export function sortList(list, sort) {
  const fields = _map(sortChecks[sort], 'value');
  const directions = _map(sortChecks[sort], 'direction');

  return _orderBy(list, fields, directions);
}

// Checks which need to be performed to determine the order that enbox items in an vault
const sortChecks = {
  // Sorting for: date DESC NULLS LAST, name ASC
  'newest': [
    { value: 'date', direction: 'desc' },
    { value: 'name', direction: 'asc' }
  ],
  // Sorting for: date ASC NULLS LAST, name ASC
  'oldest': [
    { value: 'date', direction: 'asc' },
    { value: 'name', direction: 'asc' }
  ],
  // Sorting for: name ASC
  'a-z': [
    { value: 'name', direction: 'asc' }
  ],
  // Sorting for: name DESC
  'z-a': [
    { value: 'name', direction: 'desc' }
  ],
  // Sorting for: size ASC, name ASC
  'sizeAsc': [
    { value: 'size', direction: 'asc' },
    { value: 'name', direction: 'asc' }
  ],
  // Sorting for: size DESC, name ASC
  'sizeDesc': [
    { value: 'size', direction: 'desc' },
    { value: 'name', direction: 'asc' }
  ]
};
//
const vaultValueGetter = {
  date: file => (file.date),
  name: file => (file.name),
  size: file => (file.size)
};

const vaultComparator = _mapValues(sortChecks, (value) => {
  return createComparator(value, '', vaultValueGetter);
});

// Used as references for the maximum length and index of an array.
const MAX_ARRAY_LENGTH = 4294967295;
const MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/**
 * Implements a binary search algorithm which returns the position at which the specified
 * `value` should be inserted. The comparator is invoked with the arguments (listItem, value),
 * where listItem is an item in the list and value is the specified value.
 *
 * The comparator should return a value less than zero (0) in case listItem < value and
 * a value greater than or equal to zero (0) otherwise. What equality means is left to
 * the comparator to interpret.
 *
 * Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseSortedIndexBy.js
 *
 * @private
 * @param {Array} array - The sorted array to inspect.
 * @param {*} value - The value to evaluate.
 * @param {Function} comparator - The comparator invoked per element.
 * @return {number} - Returns the index at which `value` should be inserted into `array`.
 */
function sortedIndexBy(array, value, comparator) {
  let low = 0;
  let high = array == null ? 0 : array.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const setLow = comparator(array[mid], value) < 0;

    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return Math.min(high, MAX_ARRAY_INDEX);
}

/**
 * Creates a function which can be used for comparing two items using a list of sort options.
 * Each sort option includes the value to be used for the comparison (e.g. date, description, etc.)
 * as well as the direction of the comparison (ascending or descending).
 * The comparator function is meant to be used in a binary search algorithm to determine
 * where to position an item in a list of enbox items which are sorted using the same sortOptions
 * specified here.
 *
 * NOTE: the lists are sorted by the server so the sortOptions specified here need to
 * always be in sync with the sorting approach used by the server. The sort order implemented
 * for the server is specified here for enbox:
 * https://github.com/Entefy/Iron-Man/blob/v0.2/namespaces/enbox-Namespace.md#enboxpersonal-enbox-sort-per-states
 * nowhere for vault
 *
 * @param {Object[]} sortOptions
 * @param {*}        [getterParams='']          - an optional parameter to pass to the valueGetter
 * @param {Object}   [valueGetter=getSortValue] - map key -> function to extract the field from the object
 * @return {function(prev, next)}
 */
function createComparator(sortOptions, getterParams = '', valueGetter) {
  return (prev, next) => {
    for (const sortOption of sortOptions) {
      const prevValue = valueGetter[sortOption.value](prev, getterParams);
      const nextValue = valueGetter[sortOption.value](next, getterParams);

      if (prevValue !== nextValue) {
        if (sortOption.direction === 'asc') {
          return prevValue < nextValue ? -1 : 1;
        }
        return prevValue > nextValue ? -1 : 1;
      }
    }

    return 0;
  };
}
