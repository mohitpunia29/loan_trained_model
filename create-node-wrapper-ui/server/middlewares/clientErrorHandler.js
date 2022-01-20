'use strict';

const _ = require('lodash');
const debug = require('debug')('middleware:clientErrorHandler');

// const serverErrors = require('../constants/errors.json');

// // Hash of: error.reason => error.code. Cached here to make `clientErrorHandler` faster.
// const errorCodesMap = _.reduce(serverErrors, (hash, value, key) => {
//   hash[value.reason] = key;
//   return hash;
// }, {});

/**
 * Formats all errors to be returned to the client
 *
 * @param {Error} err
 * @param {Stream} req
 * @param {Stream} res
 * @callback {Function} next
 */
module.exports = function clientErrorHandler() {
  return function(err, req, res, next) {
    if (!err) return next();

    // In case the controller did not throw an error but returned a rejected promise, the value of the promise might not
    // be an `Error` (not even an object). In such a case a new error object should be created with err as the message.
    if (!_.isObject(err)) {
      const errValue = String(err);
      err = {};
      err.message = err.stack = errValue;
    }

    if (err.status === 400) {
      // Handle special cases from external middleware
      err.code = '0000005';
      err.message = 'body is malformatted';
    }

    if (err.statusCode === undefined) {
      // No err.statusCode is set, hence the error object is populated as an unknown error
      err.statusCode = 500;
      err.code = '0000000';
      err.reason = 'UNKNOWN_ERROR';
      err.message = err.stack;
    }

    const response = {
      success: false,
      error  : {
        code   : err.code,
        reason : err.reason,
        message: err.message
      }
    };

    if (_.isObject(err.data)) {
      response.data = err.data;
    }

    debug('Rest error response', err);

    return res.status(err.statusCode)
      .send(response);
  };
};
