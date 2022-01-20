const processModels = require('./processModels');

/**
 * Makes the API calls for each of the specified models distinguishing between models
 * using the old and the new API.
 *
 * @param {UUID}     sessionId - The session id
 * @param {UUID}     userAcctId - The id of the user
 * @param {Object[]} models - The model objects
 * @param {Object[]} frames - The frame objects
 * @return {Promise[]}
 */
function scheduleModelsExecution({ sessionId, userAcctId, models, frames }) {
  async function makeApiCall(models) {
    return processModels({ sessionId, userAcctId, frames, models });
  }

  const promises = [];
  const oldApiModels = [];

  models.forEach((model) => {
    if (model.usesOldApi) {
      oldApiModels.push(model);
    } else {
      promises.push(makeApiCall([model]));
    }
  });

  if (oldApiModels.length > 0) {
    promises.push(makeApiCall(oldApiModels));
  }

  return promises;
}

module.exports = scheduleModelsExecution;
