import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { map as _map } from 'lodash';
import { Button, Drawer, IconButton, FormControlLabel, Switch } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import EndpointField from './Components/EndpointField/EndpointField';
import { withConfigContext } from '../../../Providers/ConfigProvider/ConfigProvider';

import restConfig from '../../../config/rest';

import styles from './SettingsDrawer.module.css';

const DEV_MODE = JSON.parse(localStorage.getItem('devMode'));

// const LOCALHOST = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const LOCALHOST = true;

function SettingsDrawer({ anchor, open, onDrawerToggle, configContext }) {
  const { state: { modules }, onUrlChange } = configContext;
  const [devMode, setDevMode] = useState(DEV_MODE);
  const [userType, setUserType] = useState(configContext.userType());

  // configContext.setUserType('client');

  useEffect(() => {
    localStorage.setItem('devMode', devMode);
  }, [devMode]);

  function clearAppData() {
    if (window.cleanCacheAiDemo) {
      window.cleanCacheAiDemo()
        .then(() => {
          window.location.reload();
        });
    }
  }

  function changeUserType() {
    const type = userType === 'client' ? 'vendor' : 'client';
    setUserType(type);
    configContext.setUserType(type);
    setTimeout(() => window.location.reload(), 500);
  }

  return (
    <Drawer anchor={anchor} open={open} onClose={onDrawerToggle}>
      <div className={styles.drawerContainer}>
        <IconButton
          onClick={onDrawerToggle}
          className={styles.drawerCloseIcon}
        >
          <ChevronRightIcon />
        </IconButton>
        <h2>
          Server configuration
        </h2>
        {LOCALHOST && (
          <FormControlLabel
            control={(
              <Switch
                checked={devMode}
                onChange={() => setDevMode(!devMode)}
                value={devMode}
                color='primary'
              />
            )}
            label={`Dev mode ${devMode ? 'enabled' : 'disabled'}`}
          />
        )}
        {LOCALHOST && devMode && (
          <FormControlLabel
            control={(
              <Switch
                checked={userType === 'client'}
                onChange={changeUserType}
                color='primary'
              />
            )}
            label={userType}
          />
        )}
        {_map(modules, (value, section) => (
          <div
            key={section}
            className={styles.optionsSection}
          >
            <h4 className={styles.optionsSectionTitle}>{section}</h4>
            <EndpointField
              value={restConfig[section].url}
              section={section}
              onChange={(url) => onUrlChange(section, url)}
            />
          </div>
        ))}
        {window.cleanCacheAiDemo ? (
          <Button
            className={styles.clearCacheButton}
            variant='contained'
            color='primary'
            onClick={clearAppData}
          >
            Clear cache
          </Button>
        ) : null}
      </div>
    </Drawer>
  );
}

SettingsDrawer.propTypes = {
  open          : PropTypes.bool.isRequired,
  anchor        : PropTypes.string,
  configContext : PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired
};

SettingsDrawer.defaultProps = {
  anchor: 'right'
};

export default withConfigContext(SettingsDrawer);
