const _ = require('lodash');
const express = require('express');
const router = express.Router();

const providersConfig = require('../../config/providers');
const supportedFileFormats = require('../../constants/supportedFileFormats');

const CLIENT_CONFIG = _.reduce(providersConfig, (result, value) => {
  result[value.clientConfig.name] = value.clientConfig;

  return result;
}, {});

router.get('/', async function(req, res) {
  res.json({
    supportedFileFormats,
    providers: CLIENT_CONFIG
  });
});

module.exports = router;
