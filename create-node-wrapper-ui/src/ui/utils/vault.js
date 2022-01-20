import axios from 'axios';
import {
  defaults as _defaults,
  forEach as _forEach,
  get as _get,
  isObject as _isObject,
  isString as _isString,
  map as _map,
  reduce as _reduce
} from 'lodash';

import restConfig from '../config/rest';

import { getFileExtension } from './file';

const DEFAULT_FILE_EXTENSION = 'unknown';
const SPECIAL_CASES = {
  docx: 'doc',
  csv : 'excel'
};

/**
* Returns URL with svg thumbnail
*
* @param {Object} file - file object
* @return {String}
*/
export function getThumbnailUrl(file) {
  const fileExtention = getFileExtension(file.name);

  const fileName = `${(SPECIAL_CASES[fileExtention] || fileExtention || DEFAULT_FILE_EXTENSION)}.svg`;

  return `${restConfig.fileStore.url}/file/assets/thumbnails/${fileName}`;
}

/**
* Returns file URL
*
* @param {Object} args
* @param {String} args.url       - the endpoint url
* @param {String} args.sessionId - session id
* @param {String} args.id        - file id
* @param {String} [args.name]    - file name
* @return {String}
*/
export function getFileUrl({ sessionId, id, name }) {
  if (!_isString(id)) {
    throw new Error('Parameter id is required and must be a string');
  }
  if (!_isString(sessionId)) {
    throw new Error('Parameter sessionId is required and must be a string');
  }

  let url = `${restConfig.fileStore.url}/file/${id}`;
  if (name) {
    url += `/${name}`;
  }
  url += `?sessionId=${sessionId}`;

  return url;
}

/**
* Returns a thumbnail file URL
*
* @param {Object} args
* @param {String} args.url       - the endpoint url
* @param {String} args.sessionId - session id
* @param {String} args.id        - file id
* @return {String}
*/
export function getFileThumbnailUrl({ sessionId, id, constraints }) {
  if (!_isString(id)) {
    throw new Error('Parameter id is required and must be a string');
  }
  if (!_isString(sessionId)) {
    throw new Error('Parameter sessionId is required and must be a string');
  }

  let url = `${restConfig.fileStore.url}/file/thumbnail/${id}`;
  url += `?sessionId=${sessionId}`;

  _forEach(constraints, (constraint, constraintName) => {
    url += `&${constraintName}=${constraint}`;
  });

  return url;
}

// APIs

const CREATE_FILE_ALLOWED_FIELDS = [
  'id', 'name', 'isExplicit', 'apcKeyIds',
  'parentFolderId', 'kind', 'isAttachment',
  'parentFileDescriptorId'
];

/**
 * Retrieving rootFolderId
 *
 * @method login
 * @return {string} authToken - The authToken of the user
 * @return {Action}
 */
export function getRootFolderId(authToken) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }

  return axios({
    url    : '/files/info',
    method : 'get',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(resp => ({
      success: resp.data.success,
      data   : resp.data.success ? resp.data.data.rootFolderId : resp.data.error
    }))
    .catch(e => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Create a file for vault
 *
 * @method createFile
 * @param  {string}              authToken The authToken of the user
 * @param  {Blob}                file      A file blob
 * @param  {Object}              params    The metadata of the file
 * @return {Action}
 */
export async function createFile(authToken, file, params = {}) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }
  if (!_isObject(file)) {
    throw new Error('Parameter file is required and must be an object');
  }
  if (!_isObject(params)) {
    throw new Error('Parameter params is required and must be a string');
  }

  const formData = new FormData();

  params.kind = 'file'; // eslint-disable-line no-param-reassign
  params.parentFolderId = params.rootFolderId; // eslint-disable-line no-param-reassign
  params.name = params.name || file.name; // eslint-disable-line no-param-reassign
  for (const field of CREATE_FILE_ALLOWED_FIELDS) {
    if (field in params) {
      formData.append(field, params[field]);
    } else if (field in file) {
      formData.append(field, file[field]);
    }
  }
  formData.append('file', file, params.name);
  formData.append('renameFileOnConflict', true);

  // Make the api call to create a vault file
  return axios({
    url    : `/file/create/${params.id}`,
    method : 'post',
    baseURL: restConfig.fileStore.url,
    data   : formData,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(resp => ({
      success: resp.data.success,
      data   : resp.data.data.id
    }))
    .catch((e) => {
      const data = _get(e, 'response.data', {});

      return {
        success: false,
        data   : data.error ? data.error.message : _get(e, 'response.status')
      };
    });
}

/**
 * Delete a file
 *
 * @method deleteFile
 * @param  {string}   authToken The authToken of the user
 * @param  {string}   fileId The id of the file
 * @return {Action}
 */
export function deleteFile(authToken, fileId) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authtoken is required and must be a string');
  }
  if (!_isString(fileId)) {
    throw new Error('Parameter fileId is required and must be a string');
  }

  // Make the api call to create a vault file
  return axios({
    url    : `/file/${fileId}`,
    method : 'delete',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(resp => ({
      success: resp.data.success,
      data   : resp.data.correlationId
    }))
    .catch(e => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Get a file
 *
 * @method getFile
 * @param  {string} sessionId The authToken of the user
 * @param  {string} fileId    The id of the file
 * @return {Action}
 */
export function getFile(sessionId, fileId) {
  if (!_isString(sessionId)) {
    throw new Error('Parameter sessionId is required and must be a string');
  }
  if (!_isString(fileId)) {
    throw new Error('Parameter fileId is required and must be a string');
  }

  // Make the api call to retrieve a vault file
  return axios({
    url    : `/file/${fileId}?sessionId=${sessionId}`,
    method : 'get',
    baseURL: restConfig.fileStore.url
  })
    .then(resp => ({
      success: resp.status === 200,
      data   : resp.data
    }))
    .catch(e => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Retrieving all files
 *
 * @method getFiles
 * @param  {string} authToken - The authToken of the user
 * @return {Action}
 */
export function getFiles(authToken, params = {}) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }

  return axios({
    url    : '/files',
    method : 'get',
    baseURL: restConfig.fileStore.url,
    params : _defaults({}, params, {
      start: 0,
      kind : 'file'
    }),
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(resp => ({
      success: resp.data.success,
      data   : resp.data.data.list
    }))
    .catch(e => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}

/**
 * Retrieving Meta
 *
 * @method getFileAiMeta
 * @param  {string} authToken The authToken of the user
 * @param  {string} fileId The id of the file
 * @return {Action}
 */
export function getFileAiMeta(authToken, fileId) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }
  if (!_isString(fileId)) {
    throw new Error('Parameter fileId is required and must be a string');
  }

  return axios({
    url    : `/file/meta/${fileId}`,
    method : 'get',
    baseURL: restConfig.fileStore.url,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(resp => (resp.data.success ? resp.data.data.aiMeta : null))
    .catch((e) => {
      console.log('getFileMeta error', e);

      return null;
    });
}

/**
 * Process the files with aiMeta
 *
 * @method processWithAi
 * @param  {string} authToken - The authToken of the user
 * @param  {Object} query     - An object mapping the file Id to the models to process
 *                              @example:
 *                              { "[id]": [[model][, [model]]] }
 * @return {Action}
 */
export function processWithAi(authToken, query) {
  if (!_isString(authToken)) {
    throw new Error('Parameter authToken is required and must be a string');
  }

  return axios({
    url    : '/file/processWithAi',
    method : 'post',
    baseURL: restConfig.fileStore.url,
    data   : {
      files: _map(query, ({ id, models }) => ({
        id,
        models: _reduce(models, (aggregator, model) => {
          aggregator[model] = [{}];

          return aggregator;
        }, {})
      }))
    },
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(resp => (resp.data.success ? resp.data.data : {}))
    .catch((e) => {
      console.log('processWithAi error', e);

      return {};
    });
}
