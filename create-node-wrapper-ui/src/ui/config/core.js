import { get as _get } from 'lodash';

const config = process.env.REACT_APP_NTFY_CONFIG;

// change APP TAB Title to custom Title
document.title = process.env.REACT_APP_TAB_TITLE;

export default config;

export function get(path, defaultVal) {
  return _get(config, path, defaultVal);
}
