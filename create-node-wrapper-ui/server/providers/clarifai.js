const _ = require('lodash');
const uuid = require('uuid/v4');

const clarifaiConfig = require('../config/providers').clarifai;
const filePathToBase64 = require('../modules/filePathToBase64');
const proxyRequest = require('../modules/proxyRequest');
const getFileType = require('../modules/getFileType');

class ClarifaiClient {
  async init() {
    // nothing
  }

  async process({ payload, filePath }) {
    const BASE64 = await filePathToBase64(filePath);
    const fileType = getFileType(payload.fileName);
    if (!fileType) {
      throw new Error('Unsupported file type for fileName: ' + payload.fileName);
    }

    const response = await proxyRequest({
      endpoint: `${clarifaiConfig.domain}/v2/models/${payload.model}/outputs`,
      headers : {
        'Authorization': 'Key ' + clarifaiConfig.apiKey
      },
      data: {
        inputs: [{
          data: {
            [fileType]: {
              base64: BASE64
            }
          }
        }]
      }
    });

    console.log('Clarifai response:', JSON.stringify(response, false, 2));

    return {
      [payload.model]: ClarifaiClient.parseResponse(response)
    };
  }

  /**
   * Parse and format the response
   *
   * @param {Object} response
   * @return {Object}
   */
  static parseResponse(response) {
    const TAG_FIELDS = ['id', 'name', 'value'];
    const result = {};
    const frames = _.get(response, 'outputs[0].data.frames');
    let tags = _.get(response, 'outputs[0].data.concepts');

    // TODO: for now we just get the tags from the first frame only
    if (_.isArray(frames)) {
      tags = _.get(frames, '[0].data.concepts');
    }

    if (_.isArray(tags)) {
      result.tags = _.map(tags, (tag) => {
        return _.pick(tag, TAG_FIELDS);
      });
    }

    const regions = _.get(response, 'outputs[0].data.regions');

    if (_.isArray(regions)) {
      result.regions = regions.reduce((aggregator, region) => {
        const regionTags = _.get(region, 'data.concepts');
        aggregator.push({
          id    : uuid(),
          coords: _.get(region, 'region_info.bounding_box'),
          tags  : _.map(regionTags, (regionTag) => {
            return _.pick(regionTag, TAG_FIELDS);
          })
        });

        return aggregator;
      }, []);
    }

    return result;
  }
}

module.exports = ClarifaiClient;
