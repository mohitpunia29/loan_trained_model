const { createReadStream } = require('fs');
const { Readable } = require('stream');

const parseCsv = require('../getCsvSchema/modules/parseCsv');
const generateCSVSchema = require('../getCsvSchema/modules/generateCSVSchema');

const pipeRandomCsvToStream = require('../generateRandomCSV/modules/pipeRandomCsvToStream');

module.exports = async function(req, res, next) {
  const { path: filePath, linesCount } = req.body;

  const fileReadStream = createReadStream(filePath, 'utf8');

  try {
    const { headers, rowsOfData } = await parseCsv(fileReadStream);
    const fields = generateCSVSchema(headers, rowsOfData);

    const readStream = new Readable({
      read() {}
    });

    res.setHeader('Content-type', 'text/csv');
    res.setHeader('Content-disposition', 'attachment; filename="random.csv"');

    readStream.pipe(res)
      .on('error', next);
    pipeRandomCsvToStream(readStream, fields, linesCount);

  } catch (e) {
    return next(e);
  }
};
