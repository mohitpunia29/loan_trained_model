/**
 * Return the name of the sample file to use based on the column to sort by
 *
 * @param  {String} filename
 * @param  {String} [column]
 * @param  {String} [direction]
 * @param  {String} [type]
 * @return {String}
 */
module.exports = function getSampleFileNameForSort(filename, column, direction, type) {
  // if no sorting order, return original file
  if (!column) return filename;

  const splitFileName = filename.split('.');
  const EXTENSION = splitFileName.pop();

  return splitFileName.join('.') +
    '-' + column.toLowerCase().replace(/[\W]/g, '_') +
    '-' + direction +
    '-' + type +
    '.' + EXTENSION;
};
