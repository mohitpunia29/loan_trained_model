const _ = require('lodash');
const Promise = require('bluebird');
const request = require('request-promise');
const uuid = require('uuid');
const calculateImageSize = Promise.promisify(require('image-size'));

const AI_PIPELINE_URL = process.env.NTFY_CFG_AI_PIPELINE_URL || 'http://10.0.16.53:8000/ai-pipeline';

const parseTags = require('./parseTags');

/**
 * Makes an API request for the old CV models.
 *
 * @param {String} domain - the server domain
 * @param {String} modelId - the id(s) of the models to process the file (e.g. 'logo')
 * @param {String} sessionId - the UUID for the session
 * @param {String} fileId - the UUID for the file
 * @param {String} fileName - the name for the file
 * @param {String} filePath - the path to the file in the local file system
 * @param {String} fileType - the type of the file (image/video)
 * @returns {Promise<Object>}
 */
async function oldApi({ domain, modelId, userAcctId, sessionId, fileId, fileName, fileUrl, filePath, fileType }) {
  fileType = convertFileType(fileType);
  const { response, dimensions } = await Promise.props({
    response: request.post({
      url : AI_PIPELINE_URL,
      json: {
        server_ip   : domain,
        file_types  : [fileType],
        image_models: fileType === 'photo' ? modelId : [],
        video_models: fileType === 'video' ? modelId : [],
        data        : [{
          userAcctId,
          fileType,
          fileName,
          id : fileId,
          url: fileUrl
        }]
      }
    }),
    // Calculate the dimensions of the image to create the bounding boxes from the tags
    dimensions: calculateImageSize(filePath)
  });

  const tagsKey = userAcctId + '_' + fileId;
  console.log(`Model response for fileId ${fileId}:`, JSON.stringify(response, false, 2));

  return parseResponse(response[tagsKey], dimensions);
}

/**
 * Parses the metadata tags (scenes) associated with an image.
 *
 * @param {Object} response
 * @param {Object} dimensions
 * @returns {Object}
 */
function parseResponse(response, dimensions) {
  const result = {
    tags   : [],
    regions: []
  };

  if (response) {
    const aiMeta = _.cloneDeep(response);

    if (aiMeta.scenes) {
      _.forEach(aiMeta.scenes, function(sceneObj) {
        sceneObj.id = uuid();
        const { tags, regions } = parseTags({
          objectTags    : sceneObj.objectTags,
          confidenceTags: sceneObj.confidenceTags,
          dimensions
        });
        result.tags.push(...tags);
        result.regions.push(...regions);
      });
    } else {
      const { tags, regions } = parseTags({
        objectTags    : aiMeta.objectTags,
        confidenceTags: aiMeta.confidenceTags,
        dimensions
      });
      result.tags.push(...tags);
      result.regions.push(...regions);
    }
  }

  console.log('Parsed model response:', JSON.stringify(result, false, 2));
  return result;
}

function convertFileType(fileType) {
  return fileType === 'image' ? 'photo' : fileType;
}

module.exports = oldApi;
