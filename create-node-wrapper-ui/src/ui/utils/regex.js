const PASSWORD_STRING = '^(?=.*[ -/:-@[-`{-~])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,64}$';

/**
 * RegEx Patterns
 *
 * @type {Object}
 */
/* eslint-disable import/prefer-default-export */
export const REGEX_PATTERNS = {
  // Verifies if the string is a valid email
  EMAIL                  : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  // Matches any character that is not one of the 26 alphabets
  LETTERS                : /[^a-zA-Z]+/g,
  // Verifies if the string is a valid password
  // - Password should be between 8 and 64 characters:         {8,64}
  // - Password should have at least one special character:    [ -\/:-@[-`{-~]{1}
  // - Password should have at least one uppercase character:  [A-Z]{1}
  // - Password should have at least one lowercase character:  [a-z]{1}
  // - Password should have at least one numeric number:       [0-9]{1}
  PASSWORD_STRING, // eslint-disable-line no-useless-escape
  PASSWORD               : new RegExp(PASSWORD_STRING), // eslint-disable-line no-useless-escape
  // String should contain at least 1 special character:       [ -\/:-@[-`{-~]{1}
  SPECIAL_CHARACTERS     : /^(?=.*[ -\/:-@[-`{-~]).*$/, // eslint-disable-line no-useless-escape
  // String should contain at least one lowercase character:   [a-z]{1}
  LOWERCASE_CHARACTERS   : /^(?=.*[a-z]).*$/,
  // String should contain at least one uppercase character:   [A-Z]{1}
  UPPERCASE_CHARACTERS   : /^(?=.*[A-Z]).*$/,
  // String should contain at least one numeric number:        [0-9]{1}
  NUMERICAL_CHARACTERS   : /^(?=.*[0-9]).*$/,
  // Verifies if the string is a valid username
  // - Username should be between 3 and 30 characters
  // - Username can only have letters, numbers, and the following symbols: _-.
  USERNAME               : /^[a-zA-Z0-9-_.]{3,30}$/,
  // Alphanumeric and whitespace
  ALPHANUM_AND_WHITESPACE: /^[a-z\d\-_\s]+$/i
};
