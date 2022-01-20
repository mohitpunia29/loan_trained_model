/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';

import { Typography, Paper, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import queryString from 'query-string';

import * as contact from '../../utils/contact';
import * as vault from '../../utils/vault';
import serviceRoutes from '../../constants/serviceRoutes';

import Spinner from '../../Components/Spinner/Spinner';

import { useConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';

import coreConfig from '../../config/core';

import styles from './SingleSignOn.module.css';

// http://localhost:3000/#/auth/sso?authToken=f7dbae81-b00d-4f31-a3c2-ef2b76ef9108&isOnboarded=false&sessionId=1ad8adb9-fb86-43b7-8065-9d34e22fbf90

const { SET_PRIMARY_CONTACT_INFO, ACCOUNT_ACTIVATION_CHANGE_PASSWORD, WELCOME } = serviceRoutes;

const MAX_RETRIES = 9;

function SingleSignOn({ history, location }) {
  const [error, setError] = useState();
  const [retry, setRetry] = useState(0);
  const configContext = useConfigContext();
  const passwordChanged = Boolean(sessionStorage.getItem('passwordChanged'));
  const { authToken, sessionId, isOnboarded } = queryString.parse(location.search);
  const url = `https://${coreConfig.domains.default}`;
  const HOME = coreConfig.home;

  useEffect(() => {
    console.log('SSO', {
      authToken,
      sessionId,
      isOnboarded,
      retry,
      error
      // profile     : userProfile.data,
      // rootFolderId: getRootFolderIdResponse.data
    });
    if (authToken && !error) {
      handleSSO();
    }
    if (authToken && error && retry <= MAX_RETRIES) {
      setTimeout(() => {
        handleSSO();
        setRetry(retry + 1);
      }, 5000);
    }
  }, [retry, error]);

  async function handleSSO() {
    // getRootFolderId and userProfile
    const [getRootFolderIdResponse, userProfile] = await Promise.all([
      vault.getRootFolderId(authToken),
      contact.getUserProfile(authToken)
      // contact.getUserSession(authToken)
    ]);

    if (!getRootFolderIdResponse.success) {
      setError(getRootFolderIdResponse.error ? getRootFolderIdResponse.error.message : getRootFolderIdResponse.data);
      return false;
    }
    if (!userProfile.success) {
      setError(userProfile.data || (userProfile.error && userProfile.error.message));
      return false;
    }

    const isSSO = true;

    configContext.onEndpointDataChange(url, {
      authToken,
      sessionId,
      isOnboarded : isOnboarded === 'true',
      isSSO,
      profile     : userProfile.data,
      rootFolderId: getRootFolderIdResponse.data
    });

    if (!isOnboarded) {
      if (coreConfig.features.authChangePassword && !passwordChanged) {
        // Account Activation Flow
        history.push(ACCOUNT_ACTIVATION_CHANGE_PASSWORD);
        // return;
      }
      if (coreConfig.features.authWelcomePage) {
        // Welcome
        history.push(WELCOME);
        // return;
      }
    }

    // Activated User
    history.push(`/${HOME}`);

    return true;
  }

  return (
    <div className={styles.root}>
      <Paper className={styles.container}>
        <Typography variant='h5'>
          SSO Landing Page
        </Typography>
        <Typography variant='body1'>
          {retry <= MAX_RETRIES ? (
            <>
              <div style={{ marginBottom: 20 }}>Please wait, you will be redirected</div>
              <Spinner />
            </>
          ) : (
            <>
              <span>There was an error with your account</span>
              <br />
              <span>Please contact an Administrator</span>
            </>
          )}
        </Typography>
      </Paper>
    </div>
  );
}

SingleSignOn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.object
    })
  }).isRequired
};

SingleSignOn.defaultProps = {
};

export default withRouter(SingleSignOn);
