'use strict';

const express = require('express');
const router = express.Router();

const getCsvSchema = require('./getCsvSchema/controller');
const generateLayers = require('./generateLayers/controller');
const exportDataAsSQL = require('./exportDataAsSql/controller');
const exportSchemaAsSQL = require('./exportSchemaAsSQL/controller');
const generateRandomCSV = require('./generateRandomCSV/controller');
const randomCsv = require('./randomCsv/controller');
const csvToJson = require('./csvToJson/controller');

router.post('/getCsvSchema', getCsvSchema);

router.post('/exportSchemaAsSQL', exportSchemaAsSQL);

router.post('/exportDataAsSQL', exportDataAsSQL);

router.post('/generateLayers', generateLayers);

router.post('/generateRandomCSV', generateRandomCSV);

router.post('/randomCsv', randomCsv);

router.post('/csvToJson', csvToJson);

module.exports = router;
