const ffmpeg = require('fluent-ffmpeg');
const getFileType = require('./getFileType');

/**
 * Extract a thumbnail from a video if the provided fileName corresponds to a supported
 * video format.
 *
 * @param {String} fileName - The name of the file
 * @param {String} fileId - The id of the file
 * @param {String} filePath - the path to the file
 * @param {String} thumbnailFolder - the folder to save the thumbnail
 */
module.exports = async function extractThumbnailIfAppropriate({ fileName, fileId, filePath, thumbnailFolder }) {
  let fileType = getFileType(fileName);
  if (!fileType) {
    console.error('Unsupported file type for fileName: ' + fileName);
    return undefined;
  }

  if (fileType !== 'video') return undefined;

  // The fluent-ffmpeg library only supports png thumbnails
  const thumbnailFileName = fileId + '.png';

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .on('filenames', (filenames) => {
        console.log('Generated thumbnail for file(s): ' + filenames.join(', '));
      })
      .on('error', (err) => {
        console.error('Error while generating thumbnail for video: ' + err.message);
        reject(err);
      })
      .on('end', () => {
        console.log('Thumbnail created');
        resolve(thumbnailFileName);
      })
      .screenshots({
        timestamps: [0],
        filename  : thumbnailFileName,
        folder    : thumbnailFolder,
        size      : '640x480'
      });
  });
};
