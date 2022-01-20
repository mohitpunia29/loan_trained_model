import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import bindClassnames from 'classnames/bind';

import { withRouter } from 'react-router-dom';

import * as userAccount from '../../utils/userAccount';
import { asyncSignupFormValidators } from '../utils/apiValidators';
import serviceRoutes from '../../constants/serviceRoutes';
import { useConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';

import SetPrimaryContactInfoForm from './Forms/SetPrimaryContactInfoForm';

import styles from './SetPrimaryContactInfo.module.css';

const { LOGIN_ROUTE, SET_PRIMARY_CONTACT_INFO } = serviceRoutes;

// Bind to classnames
const classnames = bindClassnames.bind(styles);

function SetPrimaryContactInfo({ history, location }) {
  const [error, setError] = useState('');

  const configContext = useConfigContext('fileStore');
  const { state: { user: { authInfo: { token, primaryContactInfo } } }, onAuthInfoExpired } = configContext;

  async function handleSetPrimaryContactInfoSubmit(action, credentials) {
    // if there was an error and we try to sign up again, remove the previous error
    if (error) {
      setError('');
    }

    let apiCall;

    switch (action) {
      case 'emailSubmit':
        apiCall = userAccount.setPrimaryContactInfo;
        break;
      case 'resendVerificationEmail':
        apiCall = userAccount.resendVerificationEmail;
        break;
      default:
        return null;
    }

    // email submit request
    const submitEmail = await apiCall({
      token,
      ...credentials
    });
    if (!submitEmail.success) {
      const message = submitEmail.data || 'An error occured. Please check network connection';
      setError(_get(submitEmail, 'error.message', message));
      return false;
    }

    // logout the user from the unverified session
    onAuthInfoExpired();
    history.push(LOGIN_ROUTE);

    return true;
  }

  const SET_PRIMARY_CONTACT_INFO_URL = location.pathname.includes(SET_PRIMARY_CONTACT_INFO);

  // redirecting user if he doesn't have token
  if (!token && SET_PRIMARY_CONTACT_INFO_URL) {
    history.push(LOGIN_ROUTE);
  }

  return (
    <div className={classnames('root')}>
      <div className={classnames('topContainer')}>
        <SetPrimaryContactInfoForm
          onSubmit={handleSetPrimaryContactInfoSubmit}
          errorMessage={error}
          emailValidator={asyncSignupFormValidators.email}
          unverifiedUserInfo={{
            token,
            primaryContactInfo
          }}
        />
      </div>
    </div>
  );
}

SetPrimaryContactInfo.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

export default withRouter(SetPrimaryContactInfo);
