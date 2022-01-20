import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { get as _get } from 'lodash';
import bindClassnames from 'classnames/bind';

import * as userAccount from '../../utils/userAccount';
import { asyncSignupFormValidators } from '../utils/apiValidators';
import serviceRoutes from '../../constants/serviceRoutes';
import { ConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';

import SignUpForm from './Forms/SignUpForm';
import styles from './SignUp.module.css';

const { SET_PRIMARY_CONTACT_INFO } = serviceRoutes;

// Bind to classnames
const classnames = bindClassnames.bind(styles);

function SignUp({ history, location }) {
  const [error, setError] = useState('');

  const configContext = useContext(ConfigContext);

  async function handleSignUpSubmit(credentials) {
    // if there was an error and we try to sign up again, remove the previous error
    if (error) {
      setError('');
    }

    // auth request
    const authResponse = await userAccount.create(credentials);

    if (!authResponse.success) {
      const message = authResponse.data || 'Registration error. Check network connection';
      setError(_get(authResponse, 'error.message', message));
      return false;
    }

    const { token: authToken } = authResponse.data.data;

    if (authToken) {
      configContext.onEndpointDataChange(authResponse.url, {
        token: authToken
      });

      if (!location.pathname.includes(SET_PRIMARY_CONTACT_INFO)) {
        history.push(SET_PRIMARY_CONTACT_INFO);
      }
    }
    return true;
  }

  return (
    <div className={classnames('root')}>
      <div className={classnames('topContainer')}>
        <SignUpForm
          onSubmit={handleSignUpSubmit}
          errorMessage={error}
          usernameValidator={asyncSignupFormValidators.username}
        />
      </div>
    </div>
  );
}

SignUp.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

export default withRouter(SignUp);
