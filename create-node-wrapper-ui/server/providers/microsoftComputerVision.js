const _ = require('lodash');

const formDataFromFilePath = require('../modules/formDataFromFilePath');
const microsoftComputerVisionConfig = require('../config/providers').microsoftComputerVision;
const proxyRequest = require('../modules/proxyRequest');

class MicrosoftComputerVisionClient {
  async init() {
    // nothing
  }

  async process({ payload, filePath }) {
    const response = await proxyRequest({
      endpoint: `${microsoftComputerVisionConfig.domain}/analyze?visualFeatures=${payload.model}`,
      headers : {
        'Ocp-Apim-Subscription-Key': microsoftComputerVisionConfig.apiKey
      },
      formData: formDataFromFilePath({ filePath })
    });

    console.log('MicrosoftComputerVision response:', JSON.stringify(response, false, 2));

    return {
      [payload.model]: MicrosoftComputerVisionClient.parseResponse(response)
    };
  }

  /**
   * Parse and format the response
   *
   * @param {Object} response
   * @return {Object}
   */
  static parseResponse(response) {
    const result = {};
    const tags = _.get(response, 'tags');
    if (_.isArray(tags)) {
      result.tags = _.map(tags, (tag) => {
        return {
          name : tag.name,
          value: tag.confidence
        };
      });
    }

    return result;
  }
}

module.exports = MicrosoftComputerVisionClient;
