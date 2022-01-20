import { get as getConfig } from '../../config/core';
import { REGEX_PATTERNS } from '../../utils/regex';

const signup = getConfig('modules.signup.variables');

// separate fields configs
const PASSWORD_CONFIG = {
  label     : 'Password',
  validators: [
    'required',
    'minStringLength:8',
    'maxStringLength:64',
    `matchRegexp:${REGEX_PATTERNS.PASSWORD_STRING}`
  ],
  errorMessages: [
    'this field is required',
    'Password should have at least 8 characters.',
    'Password should have at most 64 characters.',
    'Password should have at least 1 number, 1 uppercase, 1 lowercase, and 1 special character.'
  ],
  type: 'password'
};

const CONFIRM_PASSWORD_CONFIG = {
  label        : 'Confirm Password',
  validators   : ['isPasswordMatch', 'required'],
  errorMessages: ['password mismatch', 'this field is required'],
  type         : 'password'
};

const USERNAME_CONFIG = {
  label        : 'Username (must be email address)',
  validators   : ['required', 'minStringLength:3', 'isEmail'],
  errorMessages: [
    'this field is required',
    'username should have at least 3 characters',
    'username should be in the form of an email'
  ]
};

const USER_TYPE_CONFIG = {
  label: 'User Type'
};

const TEAM_CONFIG = {
  label: 'Vendor'
};

// form configurations
export const LOGIN_CONFIG = {
  username: {
    label        : 'Username',
    validators   : ['required'],
    errorMessages: ['this field is required']
  },
  password: {
    label        : 'Password',
    validators   : ['required'],
    errorMessages: ['this field is required'],
    type         : 'password'
  }
};

export const SIGN_UP_FORM_CONFIG = {
  firstname: {
    label        : 'First Name',
    validators   : ['required', 'minStringLength: 2'],
    errorMessages: ['this field is required', 'this field should have at least 2 characters']
  },
  lastname: {
    label        : 'Last Name',
    validators   : ['required', 'minStringLength: 2'],
    errorMessages: ['this field is required', 'this field should have at least 2 characters']
  },
  userType       : USER_TYPE_CONFIG,
  team           : TEAM_CONFIG,
  username       : USERNAME_CONFIG,
  password       : PASSWORD_CONFIG,
  confirmPassword: CONFIRM_PASSWORD_CONFIG
};

// if (!signup || (signup && !signup.WITH_VENDOR_SELECTOR)) {
//   delete SIGN_UP_FORM_CONFIG.userType;
//   delete SIGN_UP_FORM_CONFIG.team;
// }

export const VERIFY_IDENTITY_FORM_CONFIG = {
  email: {
    label        : 'Email',
    validators   : ['required', 'isEmail'],
    errorMessages: ['this field is required', 'email is not valid']
  }
};

export const RESET_PASSWORD_CONFIG = {
  username     : USERNAME_CONFIG,
  temporaryCode: {
    label        : 'Temporary Code',
    validators   : ['required'],
    errorMessages: ['this field is required']
  },
  password: {
    ...PASSWORD_CONFIG,
    label: 'New Password'
  },
  confirmPassword: CONFIRM_PASSWORD_CONFIG
};

export const NEW_PASSWORD_CONFIG = {
  currentPassword: {
    ...PASSWORD_CONFIG,
    label: 'Current Password'
  },
  newPassword: {
    ...PASSWORD_CONFIG,
    label: 'New Password'
  },
  confirmPassword: {
    ...CONFIRM_PASSWORD_CONFIG,
    label: 'Confirm New Password'
  }
};

if (signup && signup.WITHOUT_PASSWORD_FIELDS) {
  delete SIGN_UP_FORM_CONFIG.password;
  delete SIGN_UP_FORM_CONFIG.confirmPassword;
}
if (signup && !signup.WITH_VENDOR_SELECTOR) {
  delete SIGN_UP_FORM_CONFIG.userType;
  delete SIGN_UP_FORM_CONFIG.team;
}
