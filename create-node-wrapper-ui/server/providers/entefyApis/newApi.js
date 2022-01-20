const _ = require('lodash');
const request = require('request-promise');
const uuid = require('uuid/v4');

/**
 * Makes an API request for the new CV models.
 *
 * @param {String} domain - the server domain
 * @param {String} modelId - the model id (e.g. 'logo')
 * @param {String} sessionId - the UUID for the session
 * @param {String} fileId - the UUID for the file
 * @returns {Promise<Object>}
 */
async function newApi({ domain, modelId, sessionId, fileId }) {
  const response = await request.post({
    url : `${domain}/${modelId}`, // trailing / needed
    json: {
      filePath: `${sessionId}/${fileId}`
    }
  });

  console.log('EntefyClient response:', JSON.stringify(response, false, 2));

  return parseResponse(response);
}

/**
 * Parse and format the response
 *
 * @param {Object} response
 * @return {Object}
 */
function parseResponse(response) {
  const TAG_FIELDS = ['name', 'value'];
  const result = {};
  const tags = _.get(response, 'data.data.concepts');
  if (_.isArray(tags)) {
    result.tags = _.map(tags, (tag) => {
      return _.pick(tag, TAG_FIELDS);
    });
  }

  const regions = _.get(response, 'data.data.regions');

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

module.exports = newApi;
