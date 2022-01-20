'use strict';

const { Readable } = require('stream');

const pipeRandomCsvToStream = require('./modules/pipeRandomCsvToStream');

module.exports = async function(req, res) {
  const { fields, name } = req.body.files[0];
  const NEW_NAME = name.replace('.csv', '_randomized.csv');

  const readStream = new Readable({
    read() {}
  });

  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-disposition', `attachment; filename="${NEW_NAME}"`);
  readStream.pipe(res);

  pipeRandomCsvToStream(readStream, fields);
};
