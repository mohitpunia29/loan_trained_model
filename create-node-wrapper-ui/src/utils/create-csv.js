const _ = require('lodash');
const fs = require('fs');
const moment = require('moment-timezone');
const schema = require('./schema.json');

let index = process.argv[2];
const rows = process.argv[3];

const dateObj = moment();

const filename = `./src/utils/files/file_rows_${rows}_from_${index}-${dateObj.format('MM-DD-YYYY')}.csv`;

if (!index || !rows) {
  console.log('Not proper arguments provided');
  return;
}

const frequencies = [
  'Annually', 'Monthly', 'Bi-Monthly', 'Semi-Monthly',
  'Quarterly', 'Bi-Weekly', 'Weekly', 'Hourly'
];
const transform = {
  increment         : () => ++index,
  same              : () => index,
  date              : () => dateObj.format('MM/DD/YYYY'),
  randomInterestRate: () => (1 + Math.random() * 7).toFixed(2),
  randomAmount      : () => (500 + Math.random() * 25000).toFixed(0),
  randomPayment     : () => (Math.random() * 2500).toFixed(0),
  randomNumber      : () => (Math.random() * 200).toFixed(0),
  randomDecision    : () => (Math.random() > 0.5 ? 'LO Approved' : 'Rejected'),
  randomString      : () => (Math.random() > 0.5 ? 'Lorem ipsum dolor' : 'Etiam efficitur ornare'),
  randomFrequency   : () => (frequencies[_.random(0, frequencies.length - 1)]),
  randomYesOrNo     : () => (['Yes', 'No'][_.random(0, 1)]),
  randomFico        : () => _.random(300, 850)
};

const keys = Object.keys(schema);
const headers = keys.join(',');

// eslint-disable-next-line prefer-template
const returnCsv = `${headers}\n` +
  _.times(rows, () => (
    _.map(keys, key => (schema[key] ? transform[schema[key]]() : '')).join(',')
  )).join('\n');

fs.writeFile(filename, returnCsv, (err) => { (err ? console.log(err) : console.log('file saved')); });
