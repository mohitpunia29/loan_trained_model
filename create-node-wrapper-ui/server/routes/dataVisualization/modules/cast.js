/* eslint-disable no-confusing-arrow, arrow-body-style */
const _ = require('lodash');
const moment = require('moment-timezone');
// const BigNumber = require('big-number');

const castFunctions = {
  // numeric
  BIT       : value => value ? 1 : 0,
  TINYINT   : value => castToNumeric('TINYINT', value),
  BOOL      : value => Boolean(value),
  SMALLINT  : value => castToNumeric('SMALLINT', value),
  MEDIUMINT : value => castToNumeric('MEDIUMINT', value),
  INT       : value => castToNumeric('INT', value),
  BIGINT    : value => castToNumeric('BIGINT', value),
  DECIMAL   : value => castToNumeric('DECIMAL', value),
  FLOAT     : value => castToNumeric('FLOAT', value),
  DOUBLE    : value => castToNumeric('DOUBLE', value),
  // date
  DATE      : value => castToDate('DATE', value),
  DATETIME  : value => castToDate('DATETIME', value),
  TIMESTAMP : value => castToDate('TIMESTAMP', value),
  TIME      : value => castToDate('TIME', value),
  YEAR      : value => castToDate('YEAR', value),
  // string
  CHAR      : value => castToString('CHAR', value),
  VARCHAR   : value => castToString('VARCHAR', value),
  BINARY    : String,
  VARBINARY : String,
  TINYBLOB  : String,
  TINYTEXT  : String,
  BLOB      : String,
  TEXT      : String,
  MEDIUMBLOB: String,
  MEDIUMTEXT: String,
  LONGBLOB  : String,
  LONGTEXT  : String,
  ENUM      : String,
  SET       : String
};

function castToNumeric(type, value) {
  const floatVal = parseFloat(value);
  const intVal = _.round(floatVal);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(floatVal)) return 0;

  switch (type) {
    // can be 0 to 255 if UNSIGNED*.
    case 'TINYINT':
      return inRangeOrClamp(intVal, -128, 127);
    // can be 0 to 65535 if UNSIGNED*.
    case 'SMALLINT':
      return inRangeOrClamp(intVal, -32768, 32767);
    // can be 0 to 16777215 if UNSIGNED*.
    case 'MEDIUMINT':
      return inRangeOrClamp(intVal, -8388608, 8388607);
    // can be 0 to 4294967295 if UNSIGNED*.
    case 'INT':
      return inRangeOrClamp(intVal, -2147483648, 2147483647);
    // can be 0 to 18446744073709551615 UNSIGNED
    case 'BIGINT': {
      // const MAX_VAL = '9223372036854775807';
      // const MIN_VAL = '-9223372036854775808';
      // if (Number.MAX_SAFE_INTEGER < Math.abs(value)) {
      //   if (BigNumber(value).gt(MAX_VAL)) return MAX_VAL;
      //   if (BigNumber(value).lt(MIN_VAL)) return MIN_VAL;
      // }

      return value;
    }
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL': {
      let afterCommaLength = _.toString(floatVal).split('.')[1];
      if (afterCommaLength) {
        afterCommaLength = afterCommaLength.length;

        return floatVal.toFixed(afterCommaLength);
      }

      return floatVal;
    }
  }

  return value;
}

function inRangeOrClamp(value, minVal, maxVal) {
  // other numbers
  if (_.inRange(value, minVal, maxVal)) {
    return value;
  }

  return _.clamp(value, minVal, maxVal);
}

function castToDate(type, value) {
  const parsedDate = Date.parse(value);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedDate)) return value;

  const formats = {
    DATE     : 'MM/DD/YYYY',
    DATETIME : 'YYYY-MM-DD HH:mm:ss',
    TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
    TIME     : 'HH:mm:ss',
    YEAR     : 'YYYY'
  };

  return formatDate(parsedDate, formats[type]);
}

function formatDate(date, format) {
  date = moment(date);

  return date.format(format);
}

// eslint-disable-next-line complexity
function castToString(type, value) {
  if (!_.isString(value)) {
    value = _.toString(value);
  }

  // VARCHAR
  // if (value.length > 255) return castToString('TEXT', value);
  // return value;

  switch (type) {
    case 'CHAR':
      value = value.substring(0, 255);
      break;
    case 'BINARY':
      return stringToBinary(value, 255);
    case 'VARBINARY':
      return stringToBinary(value, 65535);
    case 'VARCHAR':
    case 'TINYBLOB':
    case 'TINYTEXT':
    case 'BLOB':
    case 'TEXT':
    case 'MEDIUMBLOB':
    case 'MEDIUMTEXT':
    case 'LONGBLOB':
    case 'LONGTEXT':
    case 'ENUM':
    case 'SET':
  }

  return String(value);
}

function stringToBinary(string, maxBytes) {
  let binaryOutput = '';
  if (string.length > maxBytes) {
    string = string.substring(0, maxBytes);
  }

  for (let i = 0; i < string.length; i++) {
    binaryOutput += string[i].charCodeAt(0).toString(2) + ' ';
  }

  return binaryOutput;
}

// We don't use it but it is good to test if stringToBinary actually works
// function binaryToString(binary) {
//   const arrayOfBytes = binary.split(' ');

//   let stringOutput = '';

//   for (let i = 0; i < arrayOfBytes.length; i++) {
//     stringOutput += String.fromCharCode(parseInt(arrayOfBytes[i], 2));
//   }

//   return stringOutput;
// }

module.exports = function(value, type) {
  const returnValue = castFunctions[type](value);

  // casting to a string to prevent pipe transform crash
  return _.toString(returnValue);
};

function quoteWrap(value) {
  return '"' + value + '"';
}
