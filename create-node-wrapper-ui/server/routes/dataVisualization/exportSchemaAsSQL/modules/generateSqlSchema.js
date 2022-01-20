'use strict';

const _ = require('lodash');

/**
 * Takes files and relations
 * And generate a SQL file with the CREATE TABLE statements
 *
 * @param  {Object} args
 * @param  {Array}  args.files
 * @param  {Array}  args.relations
 * @return {String}
 */
module.exports = function generateSqlSchema({ files, relations }) {
  const INDENT = '  ';

  const tables = [];
  for (const file of files) {
    const primaryKeys = [];
    const normalizedTableName = normalizeObjectName(file.name);

    const enums = [];
    const columns = [];
    for (const field of file.fields) {
      let column = '';
      const normalizedFieldName = normalizeObjectName(field.name);
      column += `${INDENT}${normalizedFieldName} `;

      // special handling for ENUMS
      if (field.type === 'ENUM' && _.isArray(field.values) && field.values.length) {
        const { name: enumName, sql: enumStatement } = createEnum(normalizedTableName, field);
        enums.push(enumStatement);
        column += enumName;
      } else {
        column += field.type;
      }
      if (field.length) {
        column += `(${field.length})`;
      }

      if (!field.null) {
        column += ' NOT NULL';
      }

      if (field.default) {
        column += ` DEFAULT ${field.default}`;
      }
      columns.push(column);

      if (field.primaryKey) {
        primaryKeys.push(normalizedFieldName);
      }
    }

    if (primaryKeys.length !== 0) {
      columns.push(`${INDENT}PRIMARY KEY (${primaryKeys.join(', ')})`);
    }

    for (const relation of relations) {
      if (relation[0].fileId === file.id) {
        const referencedFile = _.find(files, {
          id: relation[1].fileId
        });
        columns.push(`${INDENT}FOREIGN KEY (${normalizeObjectName(relation[0].field)})` +
          ' REFERENCES ' +
          `${normalizeObjectName(referencedFile.name)}(${relation[1].field})`);
      }
    }

    tables.push(...enums);
    tables.push(`CREATE TABLE ${normalizedTableName} (\n` +
      columns.join(',\n') +
      '\n);');
  }

  return tables.join('\n\n') + '\n\n';
};

function normalizeObjectName(name) {
  name = name
    .replace('.csv', '')
    // https://dev.mysql.com/doc/refman/5.5/en/identifiers.html
    .replace(/[^0-9,a-zA-Z$_]/g, '_');

  return _.trim(name, '_');
}

function createEnum(tableName, field) {
  const name = `${tableName}_${field.name}_enum`;
  const sql = `CREATE TYPE ${name} AS ENUM ('${field.values.join('\', \'')}');`;

  return { name, sql };
}
