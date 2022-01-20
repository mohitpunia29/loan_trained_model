const getDb = require('../../modules/getDb');

/**
 * Updates or creates a session for the specified sessionId with the metadata associated
 * with a new file that has been uploaded.
 *
 * TODO: For the JSON db we should save the data in a files object using the checksum of
 * the file as the key. We can then have a sessions key which will be a list of fileIds
 * (checksum ids).
 *
 * @param {UUID} sessionId
 * @param {UUID} id
 * @param {String} thumbnail
 * @param {String} fileName
 * @returns {Promise}
 */
module.exports = async function updateDb({ sessionId, id, thumbnail, fileName }) {
  const db = await getDb();
  const sessionExists = await db.has(`sessions.${sessionId}`).value();
  console.log('sessionExists: ', sessionExists);

  const fileMeta = {
    id,
    thumbnail,
    fileName
  };

  if (!sessionExists) {
    await db.set(`sessions.${sessionId}`, {
      [id]: fileMeta
    })
      .write()
  } else {
    await db.set(`sessions.${sessionId}.${id}`, fileMeta)
      .write()
  }
};
