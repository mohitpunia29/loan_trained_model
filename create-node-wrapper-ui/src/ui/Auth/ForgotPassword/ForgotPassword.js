import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { some as _some, merge as _merge, get as _get } from 'lodash';

import { withRouter } from 'react-router-dom';
import { Paper } from '@material-ui/core';

import { VERIFY_IDENTITY_FORM_CONFIG as FORGOT_PASSWORD_CONFIG } from '../config/fields';
import serviceRoutes from '../../constants/serviceRoutes';
import { REGEX_PATTERNS } from '../../utils/regex';
import * as userAccount from '../../utils/userAccount';

import FormError from '../Components/FormError/FormError';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import RenderForm from '../Components/RenderForm/RenderForm';

import styles from './ForgotPassword.module.css';

const { LOGIN_ROUTE } = serviceRoutes;

function ForgotPassword({ history }) {
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState('');
  const [email, setEmail] = useState('');

  const FORGOT_PASSWORD_CONFIG_UPDATE = {
    email: {
      onChange: (e) => {
        setEmail(e.target.value);
        setFormError('');
      },
      value: email
    }
  };

  async function submitForgotPassword() {
    if (!email || !REGEX_PATTERNS.EMAIL.test(email)) return null;
    setPending(true);
    const submitForgotPasswordRequest = await userAccount.passwordForgotten(email);
    setPending(false);

    if (!submitForgotPasswordRequest.success) {
      const message = submitForgotPasswordRequest.data || 'An error occured. Please check network connection';
      setFormError(_get(submitForgotPasswordRequest, 'error.message', message));
      return false;
    }
    history.push(LOGIN_ROUTE);
    return true;
  }

  function handleErrorValidationOnSubmit(errors) {
    setFormError(_some(errors, 'state.isValid') ? '' : 'Please fill out the form');
  }

  return (
    <div className={styles.root}>
      <Paper className={styles.container}>
        <RenderForm
          title='Forgot Password'
          onSubmit={submitForgotPassword}
          onError={(errors) => handleErrorValidationOnSubmit(errors)}
          fields={_merge({},
            FORGOT_PASSWORD_CONFIG,
            FORGOT_PASSWORD_CONFIG_UPDATE)}
          errorOutput={<FormError errorMessage='' formError={formError} />}
          submitButton={(
            <SubmitButton
              pending={pending}
              text='Reset password'
              disabled={!email}
            />
          )}
        />
      </Paper>
    </div>
  );
}

ForgotPassword.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withRouter(ForgotPassword);
