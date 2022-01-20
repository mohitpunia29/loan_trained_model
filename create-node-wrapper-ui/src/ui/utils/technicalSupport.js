import axios from 'axios';
import {
  get as _get
} from 'lodash';

import restConfig from '../config/rest';

/**
 * mailing Support
 *
 * @method contactSupport
 * @return {Action}
 */
export const contactSupport = ({ from, subject, text }) => {
  return axios({
    url    : '/technicalSupport',
    method : 'post',
//     baseURL: 'http://localhost:8000',
    baseURL: restConfig.fileStore.url,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
    data   : {
      from,
      subject,
      text
    }
  })
    .then(resp => ({
      success: resp.data.success,
      url    : restConfig.fileStore.url,
      data   : resp.data.success ? resp.data.data : resp.data.error
    }))
    .catch(e => ({
      success: false,
      data   : _get(e, 'response.data.error') ? e.response.data.error.message : _get(e, 'response.status')
    }));
};
