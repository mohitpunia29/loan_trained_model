'use strict';

const BASIC_DATE_REGEX = /[0-9]{1,4}([:\/-])[0-9]{1,2}\1[0-9]{1,4}/;

function typeOfField(dataFirstLine, index) {
  const value = dataFirstLine[index];

  // BOOL
  if (value === 'true' || value === 'false') return 'BOOL';

  // DATE
  const HAS_DATE_FORMAT = BASIC_DATE_REGEX.test(value);
  const parsedDate = Date.parse(value);
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parsedDate) && HAS_DATE_FORMAT) return 'DATE';

  // FLOAT and BIGINT (numbers)
  const floatVal = parseFloat(value);
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(floatVal)) {
    if (floatVal % 1 === 0) return 'BIGINT';

    return 'FLOAT';
  }

  return 'TEXT';
}

module.exports = function(dataFirstLine, index) {
  return typeOfField(dataFirstLine, index);
};
