const _ = require('lodash');

const cast = require('../../modules/cast');

const DEFAULT_ROWS_QUANTITY = 100;

function getRandomCSV(readStream, fields, lines = DEFAULT_ROWS_QUANTITY) {
  readStream.push(_.map(fields, 'name').join() + '\n');

  for (let i = 0; i < lines; i++) {
    readStream.push(_.map(fields, getRandomValueOfType).join(',') + '\n');
  }

  readStream.push(null);
}

module.exports = getRandomCSV;

function getRandomValueOfType(field) {
  const value = getValue(field.type, field);

  return cast(value, field.type);
}

const dummyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
  ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
  ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' +
  ' Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' +
  ' Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

// eslint-disable-next-line complexity
function getValue(type, field) {
  switch (type) {
    // numeric
    case 'BIT':
    case 'BOOL':
      return Math.round(Math.random());
    case 'TINYINT':
      return getRandomInt(0, 127);
    case 'SMALLINT':
      return getRandomInt(0, 32767);
    case 'MEDIUMINT':
      return getRandomInt(0, 8388607);
    case 'INT':
      return getRandomInt(field.range.min, field.range.max);
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return getRandomFloat(field.range.min, field.range.max);
    // date
    case 'DATE':
    case 'DATETIME':
    case 'TIMESTAMP':
    case 'TIME':
    case 'YEAR':
      return randomDate(new Date(2012, 0, 1), new Date());
    // string
    case 'CHAR':
      return dummyText.substring(0, 255);
    case 'BINARY':
    case 'VARBINARY':
    case 'VARCHAR':
    case 'TINYBLOB':
    case 'TINYTEXT':
    case 'BLOB':
    case 'TEXT':
    case 'MEDIUMBLOB':
    case 'MEDIUMTEXT':
    case 'LONGBLOB':
    case 'LONGTEXT':
      return dummyText;
    case 'SET':
    case 'ENUM':
      return randomSetValue(field.values);
  }
}

function randomSetValue(set) {
  return set[getRandomInt(0, set.length - 1)];
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomFloat(min, max) {
  return _.random(min, max, true);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
function getRandomInt(min, max) {
  return _.random(Math.floor(min), Math.floor(max));
}

function randomDate(start, end) {
  return new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())));
}
