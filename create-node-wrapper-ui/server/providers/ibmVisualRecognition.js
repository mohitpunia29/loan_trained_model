const _ = require('lodash');
const uuid = require('uuid/v4');
const Promise = require('bluebird');
const calculateImageSize = Promise.promisify(require('image-size'));

const formDataFromFilePath = require('../modules/formDataFromFilePath');
const ibmVisualRecognitionConfig = require('../config/providers').ibmVisualRecognition;
const proxyRequest = require('../modules/proxyRequest');

const AUTHORIZATION = 'Basic ' + Buffer.from('apiKey:' + ibmVisualRecognitionConfig.apiKey).toString('base64');

class IBMVisualRecognition {
  async init() {
    // nothing
  }

  async process({ payload, filePath }) {
    const { response, dimensions } = await Promise.props({
      response: proxyRequest({
        endpoint: `${ibmVisualRecognitionConfig.domain}/${payload.model}?version=2018-03-19`,
        headers : {
          'Authorization': AUTHORIZATION
        },
        formData: formDataFromFilePath({ filePath, key: 'images_file' })
      }),
      dimensions: calculateImageSize(filePath)
    });

    console.log('IBMVisualRecognition response:', JSON.stringify(response, false, 2),
      'with dimensions', dimensions);

    return {
      [payload.model]: IBMVisualRecognition.parseResponse(response, dimensions)
    };
  }

  /**
   * Parse and format the response
   *
   * @param {Object} response
   * @param {Object} dimensions
   * @param {Number} dimensions.height
   * @param {Number} dimensions.width
   * @return {Object}
   */
  static parseResponse(response, dimensions) {
    const result = {
      tags   : [],
      regions: []
    };

    if (response.images.length === 0) return result;

    if (response.images[0].classifiers) {
      _.forEach(response.images[0].classifiers, function(classifier) {
        result.tags.push(..._.map(classifier.classes, function(classObj) {
          return {
            name : classObj.class,
            value: classObj.score
          };
        }));
      });
    }

    if (response.images[0].faces) {
      const count = {
        male  : 0,
        female: 0
      };

      _.forEach(response.images[0].faces, function(face) {
        const gender = face.gender.gender.toLowerCase();
        const faceLocation = face.face_location;

        result.regions.push({
          id    : uuid(),
          coords: {
            'top_row'   : faceLocation.top / dimensions.height,
            'left_col'  : faceLocation.left / dimensions.width,
            'bottom_row': (faceLocation.top + faceLocation.height) / dimensions.height,
            'right_col' : (faceLocation.left + faceLocation.width) / dimensions.width
          },
          tags: [{
            name : gender + '_' + count[gender]++,
            value: face.gender.score
          }]
        });
      });
    }

    return result;
  }
}

module.exports = IBMVisualRecognition;
