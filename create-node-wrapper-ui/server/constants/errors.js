'use strict';

const _ = require('lodash');
const errorFactoryBase = require('error-factory');

const errorFactory = errorFactoryBase('vault-service');

const ERRORS = {
  namespace: 'Vault',
  groups   : [{
    name  : 'CreateFile',
    code  : '01',
    errors: [{
      code   : '001',
      reason : 'FILE_EXISTS',
      message: {
        default: 'File already exists'
      },
      statusCode: 409
    }, {
      code   : '002',
      reason : 'FILE_NOT_FOUND',
      message: {
        default: 'No pending upload for this file'
      },
      statusCode: 404
    }, {
      code   : '003',
      reason : 'NO_FILE_UPLOADED',
      message: {
        default: 'No file was uploaded'
      },
      statusCode: 400
    }, {
      code   : '004',
      reason : 'LIMIT_PART_COUNT',
      message: {
        default: 'The multipart form contains too many parts'
      },
      statusCode: 400
    }, {
      code   : '005',
      reason : 'LIMIT_FILE_COUNT',
      message: {
        default: 'Too many files were uploaded'
      },
      statusCode: 400
    }, {
      code   : '006',
      reason : 'LIMIT_FIELD_KEY',
      message: {
        default: 'A field name is too long'
      },
      statusCode: 400
    }, {
      code   : '007',
      reason : 'LIMIT_FIELD_VALUE',
      message: {
        default: 'A field value is too long'
      },
      statusCode: 400
    }, {
      code   : '008',
      reason : 'LIMIT_FIELD_COUNT',
      message: {
        default: 'Too many fields were sent'
      },
      statusCode: 400
    }, {
      code   : '009',
      reason : 'RESUME_FILE_NOT_FOUND',
      message: {
        default: 'No existing file to resume upload'
      },
      statusCode: 410
    }, {
      code   : '00A',
      reason : 'RESUME_REQUIRES_CONTENT_RANGE',
      message: {
        default: 'When resuming an upload, content-range must be set'
      },
      statusCode: 400
    }, {
      code   : '00B',
      reason : 'WRONG_FIRST_BYTE',
      message: {
        default: 'The last uploaded byte is not the one before the first currently uploaded byte'
      },
      statusCode: 409
    }, {
      code   : '00C',
      reason : 'USE_POST_FOR_INITIAL_UPLOAD',
      message: {
        default: 'The first request to create a file must be done via the POST endpoint'
      },
      statusCode: 400
    }, {
      code   : '00D',
      reason : 'CONTENT_RANGE_LENGTH_INVALID',
      message: {
        default: 'Content-range length must be set to a valid number'
      },
      statusCode: 400
    }, {
      code   : '00E',
      reason : 'NO_MULTIPLE_UPLOADS_WITH_CONTENT_RANGE',
      message: {
        default: 'Cannot upload multiple files when content-range is set'
      },
      statusCode: 400
    }]
  }, {
    name  : 'Proxy',
    code  : '02',
    errors: [{
      code   : '001',
      reason : 'FILE_DOES_NOT_EXIST',
      message: {
        default: 'File does not exist'
      },
      statusCode: 404
    }, {
      code   : '002',
      reason : 'UNSUPPORTED_PROVIDER',
      message: {
        default: 'The requested provider is not supported'
      },
      statusCode: 400
    }]
  }]
};

errorFactory.add(ERRORS);

module.exports = _.merge({
  Global: errorFactoryBase.Errors.Global.Default
}, _.pick(errorFactoryBase.Errors.Vault, _.map(ERRORS.groups, 'name')));
