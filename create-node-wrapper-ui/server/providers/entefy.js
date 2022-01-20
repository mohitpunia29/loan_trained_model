const _ = require('lodash');

const getFileType = require('../modules/getFileType');
const getCVTags = require('../modules/getCVTags/getCVTags');

class EntefyClient {
  async init() {
    // nothing
  }

  async process({ payload, sessionId, id, filePath }) {
    // the files are process via vault now
    return {};

    let fileType = getFileType(payload.fileName);
    if (!fileType) {
      throw new Error('Unsupported file type for fileName: ' + payload.fileName);
    }

    const modelIds = _.isArray(payload.model) ? payload.model : [payload.model];
    const thumbnailPath = fileType === 'video' && payload.thumbnail;

    return getCVTags({
      sessionId,
      modelIds,
      fileType,
      userAcctId: payload.userAcctId,
      filePath  : thumbnailPath || filePath,
      fileId    : id,
      fileUrl   : payload.url,
      fileName  : payload.fileName
    });
  }
}

module.exports = EntefyClient;
