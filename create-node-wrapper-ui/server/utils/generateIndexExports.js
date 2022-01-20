'use strict';

const globule = require('globule');
const path = require('path');

module.exports = function(dirname) {
  const requires = {};

  globule
    .find('*.js', { srcBase: dirname })
    .forEach((file) => {
      if (/index\.js/.test(file)) return;

      requires[file.slice(0, -3)] = require(path.resolve(dirname, file)); // eslint-disable-line global-require
    });

  return requires;
};
