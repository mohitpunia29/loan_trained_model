const _ = require('lodash');

const entefyConfig = require('../../config').providers.entefy;
const newApi = require('../../providers/entefyApis/newApi');
const oldApi = require('../../providers/entefyApis/oldApi');

/**
 * Calls the service associated with each of the specified models and for each of the
 * extracted frames.
 *
 * @param {UUID}     sessionId - The session id
 * @param {UUID}     userAcctId - The id of the user
 * @param {Object[]} models - The model objects
 * @param {Object[]} frames - The frame objects
 * @return {Promise<Object>}
 */
module.exports = async function processModels({ sessionId, userAcctId, models, frames }) {
  const result = {};

  for (const model of models) {
    result[model.modelId] = {
      modelId: model.modelId,
      frames : []
    };

    for (const frame of frames) {
      try {
        // TODO: We are processing the frames sequentially here.
        // The main reason is that for the old AI pipeline we cannot have concurrent requests (since we are not
        // interacting with the models themselves but with PSScheduler, and we need to make sure that only 1 model
        // has access to the GPU at a time). This is definitely something that should be addressed in the future,
        // plus we should also be able to batch images per model. The latter is something that is supported by the
        // old AI pipline but it's most probably not supported by the new AI models.
        const frameTags = await processFrame({ sessionId, userAcctId, model, frame });
        result[model.modelId].frames.push(frameTags);
        console.log(`Got result for modelId ${model.modelId}: `, JSON.stringify(frameTags, null, 2));
      } catch (err) {
        // Even if a model/frame fails we continue with the next one
        // We could instead skip to the next model (instead of continuing with the next frame
        // since if there is an error it most probably would be related to a specific model

        console.error('Error processing file:', err);
      }
    }
  }

  return result;
};

/**
 * Makes a request to process a frame of a video file, or the single frame of an image file.
 *
 * @param {String} domain
 * @param {UUID} sessionId
 * @param {Object} model
 * @param {Object} frame
 * @returns {Promise}
 */
async function processFrame({ sessionId, userAcctId, model, frame }) {
  const api = model.usesOldApi ? oldApi : newApi;

  return api(_.assign({
    domain: model.usesOldApi ? entefyConfig.domain.oldApi : entefyConfig.domain.newApi,
    sessionId,
    userAcctId
  }, model, frame));
}
