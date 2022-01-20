import axios from 'axios';
import uuid from 'uuid/v4';
import {
  capitalize as _capitalize,
  get as _get,
  isObject as _isObject,
  isString as _isString
} from 'lodash';
import encryptPassword from './encryptPassword';

import restConfig from '../config/rest';
/*
* api http://httpbin.org/delay/10 to make a request with 10 sec delay
* 55s is the browser timeout
* Chrome 5 mins, IE and FF 1 min https://stackoverflow.com/questions/5798707/browser-timeouts
* IE < v.8 = 5 mins http://support.microsoft.com/kb/181050
*/
const TIME_TO_CANCEL_REQUEST = 54 * 1000;

/**
 * Retrieving authToken
 *
 * @method login
 * @return {Action}
 */
export function login({ username, password }) {
  const sessionId = uuid();

  return axios({
    url    : '/userSession/auth',
    method : 'post',
    baseURL: restConfig.fileStore.url,
    data   : {
      sessionId,
      username,
      password: encryptPassword({ username, password })
    },
    timeout: TIME_TO_CANCEL_REQUEST
  })
    .then((resp) => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? {
        ...resp.data.data,
        sessionId
      } : resp.data.error
    }))
    .catch((e) => {
      console.log('e.response', e.response);
      let messageReturn = _get(e, 'response.data.error.message');
      if (!messageReturn || axios.isCancel(e)) {
        messageReturn = _get(e, 'message');
      }
      if (!messageReturn || !_isObject(_get(e, 'response.data'))) {
        messageReturn = 'Authentication error';
      }

      return ({
        success: false,
        data   : messageReturn
      });
    });
}

/**
 * Retrieving authToken
 *
 * @method logout
 * @return {Action}
 */
export function logout(authToken) {
  return axios({
    url    : '/userSession/logout',
    method : 'delete',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? {
        correlationId: resp.data.correlationId
      } : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Validate a given username
 *
 * @method validateUsername
 * @param  {string}               username The username to validate
 * @return {Action}
 */
export function validateUsername(username = '') {
  return axios({
    method : 'get',
    url    : `validation/userAccount/username/${username.toLowerCase()}`,
    baseURL: restConfig.fileStore.url
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}
/**
 * Validate a given email
 *
 * @method validateEmail
 * @param  {string}            email The email to validate
 * @return {Action}
 */
export function validateEmail(email = '') {
  return axios({
    method : 'get',
    url    : `validation/userAccount/primaryContactInfo/${email}`,
    baseURL: restConfig.fileStore.url
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Create an account for the user
 *
 * @method create
 * @param  {Object}         userInfo The user's info including username, password, name
 * @return {Action}
 */
export function create(userInfo) {
  return axios({
    method : 'post',
    url    : '/userAccount/create',
    baseURL: restConfig.fileStore.url,
    data   : {
      username : userInfo.username.toLowerCase(),
      password : encryptPassword(userInfo),
      firstName: _capitalize(userInfo.firstname),
      lastName : _capitalize(userInfo.lastname),
      // userType : userInfo.userType || 'client',
      // team     : userInfo.team
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * resetPassword an account for the user
 *
 * @method resetPassword
 * @param  {Object}         userInfo The user's info including username, password, name
 * @return {Action}
 */
export function resetPassword(userInfo) {
  return axios({
    method : 'post',
    url    : '/userAccount/resetPassword',
    baseURL: restConfig.fileStore.url,
    data   : {
      username : userInfo.username.toLowerCase(),
      password : encryptPassword(userInfo),
      token    : userInfo.token,
      resetCode: userInfo.resetCode
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * setting email for user
 *
 * @method setEmailForUser
 * @param  {Object}         userInfo The user's info including email, token
 * @return {Action}
 */
export function setPrimaryContactInfo(userInfo) {
  return axios({
    method : 'post',
    url    : '/userAccount/setPrimaryContactInfo',
    baseURL: restConfig.fileStore.url,
    data   : {
      primaryContactInfo: userInfo.email,
      token             : userInfo.token
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * update Account
 *
 * @method updateAccount
 * @param  {Object}         id user's id
 * @param  {Object}         userInfo userType and team for now
 * @return {Action}
 */
export function updateAccount(authToken, id, userInfo) {
  console.log('userInfo', userInfo);
  return axios({
    method : 'put',
    url    : '/userAccount/update',
    baseURL: restConfig.fileStore.url,
    data   : {
      id,
      ...userInfo
    },
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * delete Account
 *
 * @method deleteAccount
 * @param  {Object}         id The user's id
 * @return {Action}
 */
export function deleteAccount(authToken, id) {
  return axios({
    method : 'delete',
    url    : '/userAccount/delete',
    baseURL: restConfig.fileStore.url,
    data   : {
      id
    },
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * resend email
 *
 * @method resendVerificationEmail
 * @param  {Object}         userInfo The user's info including email, token
 * @return {Action}
 */
export function resendVerificationEmail(userInfo) {
  return axios({
    method : 'post',
    url    : '/userAccount/resendVerificationEmail',
    baseURL: restConfig.fileStore.url,
    data   : {
      token: userInfo.token
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * password forgotten request
 *
 * @method passwordForgotten
 * @param  {Object}         email The user's email
 * @return {Action}
 */
export function passwordForgotten(email) {
  if (!_isString(email)) {
    throw new Error('Parameter email is required and must be a string');
  }

  return axios({
    method : 'post',
    url    : '/userAccount/passwordForgotten',
    baseURL: restConfig.fileStore.url,
    data   : {
      primaryContactInfo: email
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Setting onboard to true
 *
 * @method onboard
 * @return {Action}
 */
export const onboard = (authToken) => {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }

  return axios({
    url    : '/userAccount/onboard',
    method : 'put',
    baseURL: restConfig.fileStore.url,
    data   : {
      isOnboarded: true
    },
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? {
        correlationId: resp.data.correlationId
      } : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
};

/**
 * Setting new password
 *
 * @method changePassword
 * @return {Action}
 */
export const changePassword = ({ currentPassword, newPassword, username, authToken }) => {
  return axios({
    url    : '/userAccount/changePassword',
    method : 'put',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    data: {
      currentPassword: encryptPassword({
        password: currentPassword,
        username
      }),
      newPassword: encryptPassword({
        password: newPassword,
        username
      })
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? {
        correlationId: resp.data.correlationId
      } : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
};

/**
 * Update User Account Settings
 *
 * @method updateAccountSettings
 * @param  {Object}         payload This is an object (for example cache) that is stored in the backend settings
 * @return {Action}
 */
export const updateAccountSettings = (authToken, payload) => {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }

  return axios({
    url    : '/userAccount/settings',
    method : 'put',
    baseURL: restConfig.fileStore.url,
    data   : {
      ...payload
    },
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
};

/**
 * Get User Account Settings
 *
 * @method getAccountSettings
 * @return {Action}
 */
export const getAccountSettings = (authToken) => {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }

  return axios({
    url    : '/userAccount/settings',
    method : 'get',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
};
