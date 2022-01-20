const _ = require('lodash');

const createModelObjects = require('./createModelObjects');
const extractVideoFrames = require('./extractVideoFrames');
const scheduleModelsExecution = require('./scheduleModelsExecution');

/**
 * It schedules the processing of the specified file using the list of modelIds specified.
 * If the file is a video it calls the appropriate service to extract the video frames.
 * For each such frame (or, if the file is an image, for the single frame associated with
 * the file), it makes a call to each of the services associated with the specified modelIds.
 * It then aggregates the tags for the various frames for each of the specified models and
 * returns them to the client.
 *
 * @param {UUID} sessionId - The session id
 * @param {UUID} userAcctId - The id of the user
 * @param {String[]} modelIds - A list of model ids
 * @param {String} fileType - the type of the file
 * @param {String} filePath - the path to the file
 * @param {UUID} fileId - the id of the file
 * @param {String} fileName - the name of the file
 * @returns {Promise<Object>}
 */
async function getCVTags({ sessionId, userAcctId, modelIds, fileType, filePath, fileId, fileUrl, fileName }) {
  if (fileType === 'video') {
    // call the video frame extraction service and save the frames URLs/filePaths
    // frames = await extractVideoFrames();
    throw new Error('Videos are not supported yet');
  }

  const models = createModelObjects(modelIds);
  const frames = await extractVideoFrames({ fileType, filePath, fileId, fileUrl, fileName });

  const promises = scheduleModelsExecution({ sessionId, userAcctId, models, frames });
  const results = await Promise.all(promises);

  return aggregateResults(results);
}

/**
 * Combine the results from the different promises into a single object where the key
 * corresponds to the modelId and the value to the tags for that model.
 * There will be a single promise for all models using the old API so we loop through
 * the results of each promise in case there are multiple models associated with it.
 *
 * @param results
 */
function aggregateResults(results) {
  return results.reduce((acc, value) => {
    _.forEach(value, (tags, modelName) => {
      acc[modelName] = tags;
    });

    return acc;
  }, {});
}

module.exports = getCVTags;
