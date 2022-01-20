import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar as AppBarComponent, Button, Toolbar } from '@material-ui/core';
import { find as _find } from 'lodash';

import SettingsDrawer from './Components/SettingsDrawer/SettingsDrawer';
import AccountBar from './Components/AccountBar/AccountBar';
import SettingsIcon from '../Components/Icons/Settings';
import TechnicalSupport from './Components/TechnicalSupport/TechnicalSupport';
import BarMenu from './BarMenu';
import { MENU } from '../constants/barMenu';
import LOGO from '../../static/entefy-logo-sq-blk.png';

import coreConfig from '../config/core';
import { ConfigContext } from '../Providers/ConfigProvider/ConfigProvider';

import styles from './AppBar.module.css';

const { features } = coreConfig || {};
// we define the defaultRoute from the menu (and not always /),
// because when a Redirect happens, it unmounts the currently displayed component
// which can be wasteful if it uses caching, etc
const defaultRoute = _find(MENU, { isDefaultRoute: true }).path;

export default function AppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const configContext = useContext(ConfigContext);

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <AppBarComponent position='sticky' className={styles.AppBar}>
      <Toolbar className={styles.ToolBar}>
        <Button
          disableRipple
          disableFocusRipple
          to={defaultRoute}
          component={NavLink}
          classes={{ root: styles.logo }}
        >
          <img src={LOGO} style={{ height: 52 }} alt={LOGO} id='home-logo' />
        </Button>
        <BarMenu />
        <div className={styles.options}>
          {features.support && <TechnicalSupport />}
          {features.login && configContext.isAuthenticated() && (
            <AccountBar />
          )}
          {features.settings && (
            <Button
              color='inherit'
              disableRipple
              disableFocusRipple
              classes={{ root: styles.optionsButton }}
              onClick={toggleDrawer}
            >
              <SettingsIcon />
            </Button>
          )}
        </div>
      </Toolbar>
      {features.settings && (
        <SettingsDrawer
          open={drawerOpen}
          onDrawerToggle={toggleDrawer}
        />
      )}
    </AppBarComponent>
  );
}
