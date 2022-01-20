/* eslint-disable import/prefer-default-export */
import {
  reduce as _reduce,
  get as _get,
  startCase as _startCase,
  kebabCase as _kebabCase
} from 'lodash';

import coreConfig from '../config/core';
import restConfig from '../config/rest';

const { modules } = coreConfig || {};

export const MENU = _reduce(restConfig, (result, config, moduleName) => {
  result.push({
    moduleName,
    menuTitle           : _startCase(_get(modules.menu, `overrides.${moduleName}`) || moduleName),
    path                : '/' + _kebabCase(moduleName),
    hide                : (config.isDefaultRoute && !_get(modules.menu, 'keepDefaultRoute', false)) || !config.isInMenu,
    isDefaultRoute      : config.isDefaultRoute,
    isDefaultVendorRoute: config.isDefaultVendorRoute,
    withAuth            : config.withAuth,
    clientOnly          : config.clientOnly,
    userType            : config.userType,
    userManagerOnly     : config.userManagerOnly
  });

  return result;
}, []);
