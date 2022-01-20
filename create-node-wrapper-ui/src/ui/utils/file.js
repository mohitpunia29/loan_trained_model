import bytes from 'bytes';

/**
 * Returns formatted file size string, like: 2.2 Kb
 *
 * @param  {String} size      - in bytes, size of the file
 * @param  {Object} [opts={}] - Additional options
 * @return {String}
 */
export function formatSize(size, opts) {
  return bytes.format(size, { unitSeparator: ' ', ...opts });
}

/**
 * Return the file extension (last string after the last .)
 * If the filename doesn't have any . in it, return ''
 *
 * @param  {String} filename
 * @return {String}
 */
export function getFileExtension(filename = '') {
  const splitFilename = filename.split('.');

  if (splitFilename.length === 1) return '';

  return splitFilename.pop().toLowerCase();
}

/**
 * Returns filename without extension
 *
 * @param {String} filename - full filename
 * @return {String}
 */
export function getFilenameWithoutExtension(filename) {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
}
