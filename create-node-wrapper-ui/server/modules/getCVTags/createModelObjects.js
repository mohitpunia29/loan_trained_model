const _ = require('lodash');
const entefyConfig = require('../../config').providers.entefy;

/**
 * Creates a list of objects describing the models corresponding to the modelIds.
 *
 * @param {String[]} modelIds - A list of model ids
 * @returns {Object[]}
 */
module.exports = function createModelObjects(modelIds) {
  const result = [];

  for (const modelId of modelIds) {
    const modelConfig = _.find(entefyConfig.clientConfig.models, { id: modelId });
    if (!modelConfig) {
      throw new Error('The specified model was not found: ' + modelId);
    }

    result.push({
      modelId   : modelId,
      usesOldApi: modelConfig.usesOldApi
    });
  }

  return result;
};
