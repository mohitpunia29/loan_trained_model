'use strict';

const _ = require('lodash');
const parseCSV = require('csv-parse');
const splitStreamByLine = require('split');

// header line and 100 lines of data
const MAX_LINE_COUNT = 101;

module.exports = async function(stream) {
  let headers;
  const rowsOfData = [];
  let rowsCount = 0;

  return new Promise(function(resolve, reject) {
    // create the csv parser
    // https://csv.js.org/parse/api/
    const parser = parseCSV({
      trim: true
    })
      .on('readable', function() {
        let record;
        // eslint-disable-next-line no-cond-assign
        while (record = parser.read()) {
          if (rowsCount === 0) {
            headers = _.map(record, normalizeHeader);
          } else if (_.inRange(rowsCount, 1, MAX_LINE_COUNT)) {
            rowsOfData.push(record);
          }
          rowsCount++;
        }
      })
      .on('error', function(err) {
        return reject(new Error('Something went wrong while parsing the data\n' + err));
      })
      .on('end', function() {
        resolve({ headers, rowsOfData });
      });

    let hasReceivedEnoughRows = false;

    // https://www.npmjs.com/package/request#streaming
    return stream
      .on('error', reject)
      // https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
      // https://github.com/dominictarr/split
      // https://www.npmjs.com/package/split#keep-matched-splitter
      .pipe(splitStreamByLine(/(\r?\n)/))
      .on('data', function(line) {
        if (line && !hasReceivedEnoughRows) {
          // we only care about the headers and the first row of data here
          // which means two lines, 1 header, 2 first line of data
          if (rowsCount >= MAX_LINE_COUNT) {
            // https://github.com/request/request-promise/issues/85
            hasReceivedEnoughRows = true;
            parser.end();
          } else {
            parser.write(line);
          }
        }
      })
      .on('error', reject)
      .on('end', function() {
        parser.end();
      });
  });
};

function normalizeHeader(header) {
  return header
    .replace(/\./g, '\\u002e');
}
