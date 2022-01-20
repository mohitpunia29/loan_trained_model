import { isEqual as _isEqual } from 'lodash';

import { REGEX_PATTERNS } from './regex';

/**
 * Validate a given password string
 *
 * @method _validatePassword
 * @param  {string}          password The password to validate
 * @return {string}
 */
export function validatePassword(password) {
  let error = '';

  if (!password) {
    error = "Please enter a valid 'Password'.";
  } else if (password.length < 8) {
    error = 'Password should have at least 8 characters.';
  } else if (password.length > 64) {
    error = 'Password should have at most 64 characters.';
  } else if (!REGEX_PATTERNS.PASSWORD.test(password)) {
    error =
      'Password should have at least 1 number, 1 uppercase, 1 lowercase, and 1 special character.';
  }

  return error;
};
