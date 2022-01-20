'use strict';

const _ = require('lodash');
const request = require('request');

const generateSql = require('./modules/generateSql');

module.exports = async function(req, res, next) {
  const fields = req.body.files[0].fields;
  const headers = _.map(req.body.files[0].fields, 'name');
  const url = req.body.files[0].url;

  const stream = request({
    uri   : url,
    method: 'GET'
  })
    .on('error', next);

  res.setHeader('Content-type', 'application/sql');
  res.setHeader('Content-disposition', 'attachment; filename=data.sql');

  generateSql({ fields, headers })(stream, next)
    .on('error', next)
    .pipe(res);
};
