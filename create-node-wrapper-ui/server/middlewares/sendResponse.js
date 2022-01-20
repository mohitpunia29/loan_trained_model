'use strict';

const _ = require('lodash');
const assert = require('assert');

const debug = require('debug')('middleware:sendResponse');

/**
 * Sends a response to the client in the event there isn't an error
 *
 * @param {Object} data
 * @param {Number} data.statusCode
 * @param {Object} data.responsePayload
 * @param {UUID}   data.correlationId
 * @param {Stream} res
 */
module.exports = function sendResponse(data, res) {
  // This might not be great to handle, but it's the best option for now
  if (!data) data = {};
  assert(_.isObject(data), 'Input "data" must be an object');
  if (data.responsePayload === undefined || data.res) data.responsePayload = {};
  assert(_.isObject(data.responsePayload), 'data.responsePayload is defined but not an object');

  _generateResponseCode(data, res);

  const response = {
    success: true,
    data   : data.responsePayload
  };

  // Provide the correlationId for requests that involve a modification
  // So the clients can track the flows using it
  // It will passed in monitoring-service notifications in case of an error
  if (res.req.method !== 'GET') {
    response.correlationId = data.correlationId;
  }

  debug('Rest response', response);

  return res.status(data.statusCode).json(response);
};

/**
 * Generates the status code for an http response when there is no error
 *
 * @param {JSON} data
 * @param {Number} data.statusCode
 * @param {Object} data.responsePayload
 * @param {Stream} res
 * @private
 */
function _generateResponseCode(data, res) {
  // Allow statusCode to be set in the controller for custom ones
  // 200 is the default, so skip it
  if (res.statusCode && res.statusCode !== 200) {
    data.statusCode = res.statusCode;
  }

  if (!data.statusCode) {
    switch (res.req.method) {
      case 'POST':
        data.statusCode = 201;
        break;
      case 'GET':
      case 'PUT':
      case 'DELETE':
        data.statusCode = 200;
        break;
      default:
        data.statusCode = 200;
        break;
    }
  }
}
