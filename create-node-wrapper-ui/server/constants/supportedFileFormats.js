'use strict';

const SUPPORTED_FORMATS = [{
  type      : 'image',
  extensions: [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'bmp',
  ]
}, {
  type      : 'video',
  extensions: [
    'mp4',
    'avi',
    'flv',
    'wmv',
    'mov'
  ]
}];

module.exports = SUPPORTED_FORMATS;
