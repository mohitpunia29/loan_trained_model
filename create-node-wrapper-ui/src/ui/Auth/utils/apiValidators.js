import * as userAccount from '../../utils/userAccount';

export const asyncSignupFormValidators = {
  username: async (username) => {
    const validations = await userAccount.validateUsername(username);
    return validations;
  },
  email: async (email) => {
    const validations = await userAccount.validateEmail(email);
    return validations;
  }
};
