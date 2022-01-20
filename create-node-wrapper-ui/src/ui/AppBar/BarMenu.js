import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import bindClassnames from 'classnames/bind';

import {
  filter as _filter,
  map as _map,
  get as _get
} from 'lodash';

import { Button } from '@material-ui/core';
import { ConfigContext } from '../Providers/ConfigProvider/ConfigProvider';
import coreConfig from '../config/core';
import { MENU } from '../constants/barMenu';

import styles from './BarMenu.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function BarMenu() {
  const configContext = useContext(ConfigContext);

  // const HIDE_MENU = !configContext.isOnboarded() || !configContext.isAuthenticated() &&
  //   _get(coreConfig.modules, 'menu.hideWhenNotAuthenticated');

    const HIDE_MENU = _get(coreConfig.modules, 'menu.hideWhenNotAuthenticated');

  return (
    <div className={classnames('root')}>
      {!HIDE_MENU && _map(_filter(MENU, (menuItem) => {
        if (menuItem.hide) return false;
        return true;
      }), (item) => (
        <Button
          color='inherit'
          key={item.path}
          className={classnames('menuItem')}
          activeClassName={classnames('activeItem')}
          component={NavLink}
          to={item.path}
        >
          {item.menuTitle}
        </Button>
      ))}
    </div>
  );
}
