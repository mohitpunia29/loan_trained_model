'use strict';

const express = require('express');
const router = express.Router();

const paginateCSV = require('./paginateCSV/controller');

router.get('/paginateCSV/:filename', paginateCSV);

module.exports = router;
