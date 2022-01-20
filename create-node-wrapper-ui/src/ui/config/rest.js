import { forEach as _forEach } from 'lodash';

import coreConfig from './core';

const { features, home, domains } = coreConfig || { features: {} };

// mandatory modules
features.fileStore = true;

const restEndpoints = {
  fileStore: {
    withAuth: false,
    isInMenu: false
  },
  home: {
    withAuth      : false,
    isInMenu      : false,
    isDefaultRoute: true
  },
  graphsDashboard: {
    withAuth: false,
    isInMenu: true
  },
  tempComponent: {
    withAuth: true,
    isInMenu: true
  }
};

_forEach(restEndpoints, (conf, feature) => {
  conf.url = `https://${domains[feature] || domains.default}`;
});

Object.keys(restEndpoints).forEach(feature => (!features[feature] ? delete restEndpoints[feature] : null));
// if config home is set, we are making all the isDefaultRoute props equal to false
// and set it to true for the config home one
if (home) {
  console.log('HOME', { home, restEndpoints });
  Object.keys(restEndpoints).forEach((feature) => { restEndpoints[feature]['isDefaultRoute'] = false; });
  restEndpoints[home].isDefaultRoute = true;
}
// NOTE: when importing this file, DO NOT destructure it
//       it needs to be an object in order to preserver the pointer

export default restEndpoints;
