'use strict';

const generateSqlSchema = require('./modules/generateSqlSchema');

module.exports = async function(req, res, next) {
  // files: [{ id, name, fields: [{ name, type, length, default, null, primaryKey }] }]
  // relations: [[{ fileId, field(name) }], [{ fileId, field(name) }]]
  const { files, relations } = req.body;

  let sql;
  try {
    sql = generateSqlSchema({ files, relations });
  } catch (e) {
    return next(new Error('Something went wrong while generating the sql schema', e.message));
  }

  res.setHeader('Content-type', 'application/sql');
  res.setHeader('Content-disposition', 'attachment; filename=schema.sql');

  res.send(sql);
};
