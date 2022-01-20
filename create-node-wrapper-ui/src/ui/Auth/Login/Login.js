import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import bindClassnames from 'classnames/bind';

import { withRouter } from 'react-router-dom';

import * as userAccount from '../../utils/userAccount';
import * as contact from '../../utils/contact';
import * as vault from '../../utils/vault';
import serviceRoutes from '../../constants/serviceRoutes';

import { useConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';
import LoginForm from './Forms/LoginForm';

import coreConfig from '../../config/core';

import styles from './Login.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const login = _get(coreConfig, 'modules.login.variables');
const { SET_PRIMARY_CONTACT_INFO, ACCOUNT_ACTIVATION_CHANGE_PASSWORD } = serviceRoutes;

function Login({ history, location, message, name }) {
  const [error, setError] = useState('');
  const configContext = useConfigContext();
  const passwordChanged = Boolean(sessionStorage.getItem('passwordChanged'));

  // use for the feature toggle
  // safeguard so that we do not spam the server if the credentials do not work
  const [hasTriedToLogin, setHasTriedToLogin] = useState(false);

  async function handleSubmit(credentials) {
    // if there was an error and we try to sign in again, remove the previous error
    if (error) {
      setError('');
    }

    // login request
    const loginResponse = await userAccount.login(credentials);

    if (!loginResponse.success) {
      const errorMessage = loginResponse.data || 'Authentication error. Check network connection';
      setError(_get(loginResponse, 'error.message', errorMessage));

      return false;
    }

    const { token, primaryContactInfo, authToken, sessionId, isOnboarded } = loginResponse.data;

    // Set Primary Contact Info: verify email scenario
    if (token) {
      configContext.onEndpointDataChange(loginResponse.url, {
        token,
        primaryContactInfo
      });
      history.push(SET_PRIMARY_CONTACT_INFO);
      return true;
    }

    // getRootFolderId and userProfile
    const [getRootFolderIdResponse, userProfile] = await Promise.all([
      vault.getRootFolderId(authToken),
      contact.getUserProfile(authToken)
    ]);

    if (!getRootFolderIdResponse.success) {
      setError(getRootFolderIdResponse.error ? getRootFolderIdResponse.error.message : getRootFolderIdResponse.data);
      return false;
    }
    if (!userProfile.success) {
      setError(userProfile.data || (userProfile.error && userProfile.error.message));
      return false;
    }

    configContext.onEndpointDataChange(loginResponse.url, {
      authToken,
      sessionId,
      isOnboarded,
      profile     : userProfile.data,
      rootFolderId: getRootFolderIdResponse.data
    });

    if (!isOnboarded) {
      if (coreConfig.features.authChangePassword && !passwordChanged) {
        // Account Activation Flow
        history.push(ACCOUNT_ACTIVATION_CHANGE_PASSWORD);
        return;
      }
      if (coreConfig.features.authWelcomePage) {
        // Welcome
        history.push(serviceRoutes.WELCOME);
        return;
      }
    }

    // Activated User
    history.push(location.state ? location.state.from : '/');

    return true;
  }

  if (!hasTriedToLogin && login && login.username && login.password) {
    setHasTriedToLogin(true);
    handleSubmit(login);
  }

  return (
    <div className={classnames('root')}>
      <div className={classnames('topContainer')}>
        {message}
        <LoginForm
          name={name}
          onSubmit={handleSubmit}
          errorMessage={error}
        />
      </div>
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.object
    })
  }).isRequired,
  message: PropTypes.string,
  name   : PropTypes.string
};

Login.defaultProps = {
  message: null,
  name   : undefined
};

export default withRouter(Login);
