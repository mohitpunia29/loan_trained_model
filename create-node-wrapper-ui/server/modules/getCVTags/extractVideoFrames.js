const _ = require('lodash');

/**
 * Extract frames from a video, for video files.
 * If the file is an image a list with a single frame representing the image will be returned.
 *
 * TODO: Update this so for video files it makes a request to the frame extraction service
 * in order to generate the frames for a video file and store them locally for processing.
 *
 * @param {String} fileType
 * @param {String} filePath
 * @param {UUID}   fileId
 * @param {String} fileUrl
 * @param {String} fileName
 * @returns {Object[]}
 */
module.exports = async function extractVideoFrames({ fileType, filePath, fileId, fileUrl, fileName }) {
  const framesCount = 1; // _.random(1, 3);
  return _.times(framesCount, () => {
    return {
      fileId,
      fileType,
      filePath,
      fileUrl,
      fileName
    };
  });
};
