'use strict';

const express = require('express');
const router = express.Router();

const generateCSVFromSample = require('./generateCSVFromSample/controller');

router.get('/generateCSVFromSample', generateCSVFromSample);

module.exports = router;
