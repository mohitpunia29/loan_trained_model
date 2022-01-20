const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const fs = require('fs').promises;
const path = require('path');
const proxyquire = require('proxyquire');

const toUtcString = require('../../../modules/toUtcString');

const CSV_FILE_PATH = path.join(__dirname, 'ts.csv');

const saveToCsv = proxyquire('./saveToCsv', {
  '../../../config/technicalSupport': {
    TECHNICAL_SUPPORT_CSV_FILE_PATH: CSV_FILE_PATH
  }
});

describe('#TechnicalSupport - modules - saveToCsv', function() {
  const mailPayload = {
    timestamp: toUtcString(),
    from     : 'nicolas@entefy.com',
    to       : 'support@entefy.com',
    subject  : 'I find your lack of unit testing disturbing',
    text     : 'Hi,\nNothing is working, go fix it ! ""' // text with new line, double quote (") and SEPARATOR (,)
  };
  const HEADER_SIZE = 31;
  const PAYLOAD_SIZE = 164;

  afterEach('Remove file', async function() {
    try {
      await fs.unlink(CSV_FILE_PATH);
    } catch (e) {}
  });

  it('Should throw if mailPayload is not provided', async function() {
    await expect(saveToCsv()).to.be.rejected;
  });

  it('Should create the file and add the headers if the file does not exist', async function() {
    await saveToCsv(mailPayload);

    const stats = await fs.stat(CSV_FILE_PATH);
    expect(stats.size).to.equal(HEADER_SIZE + PAYLOAD_SIZE);
  });

  it('Should add the headers if the file exists but is empty', async function() {
    await fs.writeFile(CSV_FILE_PATH, '', 'utf8');
    await saveToCsv(mailPayload);

    const stats = await fs.stat(CSV_FILE_PATH);
    expect(stats.size).to.equal(HEADER_SIZE + PAYLOAD_SIZE);
  });

  it('Should not add the headers once the file has data', async function() {
    const PAYLOAD_COUNT = 3;
    for (let i = 0; i < PAYLOAD_COUNT; i++) {
      await saveToCsv(mailPayload);
    }

    const stats = await fs.stat(CSV_FILE_PATH);
    expect(stats.size).to.equal(HEADER_SIZE + PAYLOAD_SIZE * PAYLOAD_COUNT);
  });
});
