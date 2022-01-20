import jsSha256 from 'js-sha256';

/**
 * Salt the password with the username
 *
 * @param  {Object} args
 * @param  {String} args.username
 * @param  {String} args.password
 * @return {String}
 */
export default function encrypt({ username, password }) {
  if (!username) {
    throw new Error('Parameter username is required');
  }
  if (!password) {
    throw new Error('Parameter password is required');
  }

  return jsSha256(`${username.toLowerCase()}${password}`);
}
