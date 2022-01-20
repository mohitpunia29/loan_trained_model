/* eslint-disable no-nested-ternary */
import axios from 'axios';
import {
  get as _get,
  isString as _isString,
  map as _map,
  mapValues as _mapValues,
  reduce as _reduce,
  transform as _transform
} from 'lodash';
import queryString from 'query-string';

import uuid from 'uuid/v4';

// this object curries info on the baseUrl
import restConfig from '../../config/rest';

const baseURL = restConfig.fileStore.url;

function errorResponse(e) {
  const errorMsg = (
    _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
  ) || e.message;
  return isNaN(errorMsg) ? errorMsg.substring(0, 250) : `Request failed with status ${errorMsg}`;
}

/**
 * Get the last {n} monitoring messages
 * swagger https://ply4696-mon.entefy.com/documentation/#/monitoring
 * @method getLastMonitoringMessages
 * @return {Action}
 */
export function getLastMonitoringMessages(authToken, n) {
  // authToken will not be used initially
  // baseURL for this specific endpoint should be https://ply4696-mon.entefy.com/
}

/**
 * Retrieve a specific sync json message with the provided entefyMsgId
 * swagger https://ply4696-mon.entefy.com/documentation/#/monitoring
 * @method getMonitoringMessage
 * @return {Action}
 */
export function getMonitoringMessage(authToken, syncId) {
  // authToken will not be used initially
  // baseURL for this specific endpoint should be https://ply4696-mon.entefy.com/
}

/**
 * Get the user rules list with email
 *
 * @method getEmailRules
 * @return {Action}
 */
export function getEmailRules(authToken) {
  return axios({
    url    : '/userManagement/emailRules',
    method : 'get',
    baseURL,
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userManagement/emailRules', resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : errorResponse(e)
    }));
}

/**
 * Get the user rules list
 *
 * @method getEmailRules
 * @return {Action}
 */
export function getRules(authToken) {
  return axios({
    url    : '/userManagement/rules',
    method : 'get',
    baseURL,
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userManagement/rules', resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : errorResponse(e)
    }));
}

/**
 * Get the user list
 *
 * @method getUsers
 * @return {Action}
 */
export function getUsers(authToken) {
  return axios({
    url    : '/userManagement/users',
    method : 'get',
    baseURL,
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userManagement/users', resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : errorResponse(e)
    }));
}

/**
 * Get the user list
 *
 * @method getTeams
 * @return {Action}
 */
export function getTeams(authToken) {
  return axios({
    url    : '/userManagement/teams',
    method : 'get',
    baseURL,
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userManagement/teams', resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : errorResponse(e)
    }));
}

/**
 * Invite a new user based on their email, etc.
 *
 * @method inviteUser
 * @return {string} email - {Optional} The legacyStyleNo of the file
 * @return {Action}
 */
export function inviteUser(authToken, email, type, team) {
  if (!email || !type) {
    throw new Error(`Parameter ${!email ? 'email' : null} ${!type ? 'type' : null} ${!team ? 'team' : null} is required and must be a string`);
  }

  return axios({
    url   : '/userManagement/rule',
    method: 'post',
    baseURL,
    data  : {
      matchingValue      : email,
      userType           : type,
      team,
      sendInvitationEmail: true
    },
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userManagement/rule', `${email}/${type}`, resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : errorResponse(e)
    }));
}

/**
 * Invite a new user based on their email, etc.
 *
 * @method deleteInvitation
 * @return {string} email - {Optional} The legacyStyleNo of the file
 * @return {Action}
 */
export function deleteInvitation(authToken, email) {
  if (!email) {
    throw new Error('Parameter email is required and must be a string');
  }

  return axios({
    url   : '/userManagement/rule',
    method: 'delete',
    baseURL,
    data  : {
      matchingValue: email
    },
    headers: {
      Authorization: `Bearer ${authToken}`
      // 'Access-Control-Allow-Origin': '*'
    }
  })
    .then((resp) => {
      console.log('/userManagement/rule', `${email}`, resp);
      const success = resp.status === 200 || _get(resp, 'data.success');
      return {
        success,
        data: success ? resp.data : resp.error
      };
    })
    .catch((e) => ({
      success: false,
      data   : errorResponse(e)
    }));
}
