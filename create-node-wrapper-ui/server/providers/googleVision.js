const _ = require('lodash');
const uuid = require('uuid/v4');

const filePathToBase64 = require('../modules/filePathToBase64');
const googleVisionConfig = require('../config/providers').googleVision;
const proxyRequest = require('../modules/proxyRequest');

class GoogleVisionClient {
  async init() {
    // nothing
  }

  async process({ payload, filePath }) {
    const BASE64 = await filePathToBase64(filePath);

    const response = await proxyRequest({
      endpoint: `${googleVisionConfig.domain}?key=${googleVisionConfig.apiKey}`,
      headers : {},
      data    : {
        requests: [{
          image: {
            content: BASE64
          },
          features: [{
            type: payload.model
          }]
        }]
      }
    });

    console.log('GoogleVision response:', JSON.stringify(response, false, 2));

    return {
      [payload.model]: GoogleVisionClient.parseResponse(response)
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
    const regions = _.get(response, 'responses[0].logoAnnotations');

    if (_.isArray(regions)) {
      result.regions = regions.reduce((aggregator, region) => {
        aggregator.push({
          id    : uuid(),
          coords: {
            'top_row'   : region.boundingPoly.vertices[0].y,
            'left_col'  : region.boundingPoly.vertices[0].x,
            'bottom_row': region.boundingPoly.vertices[2].y,
            'right_col' : region.boundingPoly.vertices[2].x
          },
          tags: [{
            name : region.description,
            value: region.score
          }]
        });

        return aggregator;
      }, []);
    }

    return result;
  }
}

module.exports = GoogleVisionClient;
