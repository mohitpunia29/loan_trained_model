import React from 'react';
import PropTypes from 'prop-types';
import {
  defaults as _defaults,
  map as _map,
  pick as _pick
} from 'lodash';

import { MenuList, MenuItem } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import * as tabsInfo from './constants/tabsInfo';

import TempSection from './Components/TempSection/TempSection';

import { AllTabsProvider } from './Components/AllTabsContext';

import styles from './TempComponent.module.css';

const TABS = _map([
  _defaults({ component: TempSection }, tabsInfo.tempSection)
], (tab) => {
  tab.route = `/temp-component/${tab.title.toLowerCase().replace(/\s/g, '-')}`;

  return tab;
});

function TempComponent({ location: { pathname }, history }) {
  return (
    <AllTabsProvider>
      <div className={styles.root}>
        <div className={styles.leftCol}>
          <MenuList>
            {_map(TABS, (mod) => (
              <MenuItem
                classes={{ selected: styles.active }}
                selected={pathname === mod.route}
                key={mod.route}
                onClick={() => (history.push(mod.route))}
              >
                <div className={styles.menuItem}>
                  <div className={styles.icon}>{mod.icon}</div>
                  <div className={styles.title}>{mod.title}</div>
                </div>
              </MenuItem>
            ))}
          </MenuList>
        </div>
        <div className={styles.rightCol}>
          <Switch>
            {_map(TABS, (tab) => (
              <Route
                path={tab.route}
                key={tab.route}
                render={() => {
                  const TheComponent = tab.component;

                  return <TheComponent />;
                }}
              />
            ))}
            <Route path='/temp-component' render={() => (<Redirect exact strict from='/temp-component' to={TABS[0].route} />)} />
          </Switch>
        </div>
      </div>
    </AllTabsProvider>
  );
}

TempComponent.propTypes = {
  location: PropTypes.object,
  history : PropTypes.object
};

export default withRouter(TempComponent);
