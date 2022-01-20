import {
  findIndex as _findIndex,
  forEach as _forEach,
  isEqual as _isEqual,
  isObject as _isObject,
  omit as _omit
} from 'lodash';

export default function mergeAiMeta(aiMeta, partialAiMeta) {
  // We are sure that partialAiMeta has the correct format, so we use it as the base
  if (aiMeta) {
    if (_isObject(aiMeta.models)) {
      // merge the models
      // we start from the current ones we have in the database
      // then add the new ones

      const { models } = aiMeta;
      _forEach(partialAiMeta.models, (modelValue, modelName) => {
        if (!models[modelName]) {
          models[modelName] = modelValue;
        } else {
          for (const value of modelValue) {
            const existingValueIndex = _findIndex(models[modelName], (valueFromDb) => {
              // file with different ids can have the same checksum, so we omit url in the comparison
              return _isEqual(_omit(valueFromDb.params, ['url']), _omit(value.params, ['url']));
            });

            if (existingValueIndex === -1) {
              // if we do not have data with the provided params, we add it
              models[modelName].push(value);
            } else {
              // if we do, we replace the value at the index
              models[modelName][existingValueIndex] = value;
            }
          }
        }
      });
      partialAiMeta.models = models;
    }
  }

  return partialAiMeta;
};
