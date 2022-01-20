const _ = require('lodash');

const typeOfField = require('../../modules/guessType');

const ENUM_RANGE = 10;

function getCSVSchema(headers, rowsOfData) {
  const resultObject = {};

  _.map(headers, (header, index) => {
    const elements = _.map(rowsOfData, index);
    resultObject[header] = {
      enum: new Set(),
      range: {
        min: 0
      }
    };

    for (let i = 0; i < elements.length; i++) {
      // is enum
      if (resultObject[header].enum.size <= ENUM_RANGE) {
        resultObject[header].enum.add(elements[i]);
      }

      // min
      if (resultObject[header].range.min > elements[i]) {
        resultObject[header].range.min = elements[i];
      }

      // max
      if (!('max' in resultObject[header].range)) {
        resultObject[header].range.max = elements[i];
      } else if (resultObject[header].range.max < elements[i]) {
        resultObject[header].range.max = elements[i];
      }
    }
  });

  return _.map(headers, (el, index) => {
    let values;
    let type = typeOfField(rowsOfData[0], index, el);

    // ENUM should only be for TEXT fields
    if (type === 'TEXT' && resultObject[el].enum.size <= ENUM_RANGE) {
      type = 'ENUM';
      values = Array.from(resultObject[el]);
    }

    return {
      name      : el,
      type,
      values,
      range     : resultObject[el].range,
      length    : '',
      default   : '',
      null      : true,
      primaryKey: false
    };
  });
}

module.exports = getCSVSchema;
