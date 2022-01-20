import axios from 'axios';
import {
  get as _get,
  isString as _isString
} from 'lodash';

import restConfig from '../config/rest';

const path = 'dataVisualization';

/**
 * Convert a CSV to a JSON
 *
 * @param {Object} file - file object
 * @return {String}
 */
export function csvToJson(csv) {
  if (!_isString(csv)) {
    throw new Error('Parameter csv is required and must be a string');
  }

  return axios({
    url    : `/${path}/csvToJson`,
    method : 'post',
    baseURL: restConfig.dataVisualization.url,
    // baseURL: 'http://localhost:8000',
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    data   : { csv }
  })
    .then(resp => ({
      success: true,
      data   : resp.data
    }))
    .catch(e => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
}
