import axios from 'axios';
import { get as _get, isString as _isString } from 'lodash';

import restConfig from '../config/rest';

/**
 * Retrieving user profile
 *
 * @method getUserProfile
 * @return {string} authToken - The authToken of the user
 * @return {Action}
 */
export function getUserProfile(authToken) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }
  // console.log('authToken', authToken);
  return axios({
    url    : '/contact/user/profile',
    method : 'get',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then((resp) => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data.data : resp.data.error
    }))
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Retrieving getUserSession
 *
 * @method getUserSession
 * @return {string} client - {Optional} if client is SSO
 * @return {Action}
 */
export function getUserSession(authToken, url) {
  return axios({
    url    : '/userSession/client',
    method : 'get',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userSessions/client', resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}
