const Readable = require('stream').Readable;

module.exports = function stringToStream(str) {
  const s = new Readable();
  s._read = () => {};
  s.push(str);
  s.push(null);

  return s;
}
