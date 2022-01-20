import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { some as _some, merge as _merge, get as _get } from 'lodash';
import bindClassnames from 'classnames/bind';

import { withRouter } from 'react-router-dom';
import { Paper, Typography } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { RESET_PASSWORD_CONFIG } from '../config/fields';
import serviceRoutes from '../../constants/serviceRoutes';
import * as userAccount from '../../utils/userAccount';
import useFormInput from '../Hooks/useFormInput/useFormInput';

import FormError from '../Components/FormError/FormError';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import RenderForm from '../Components/RenderForm/RenderForm';

import styles from './ResetPassword.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const { LOGIN_ROUTE, FORGOT_PASSWORD } = serviceRoutes;

function ResetPassword({ history, location }) {
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const [token, setToken] = useState('');
  const [username, setUsername] = useFormInput('', setFormError);
  const [temporaryCode, setTemporaryCode] = useFormInput('', setFormError);
  const [password, setPassword] = useFormInput('', setFormError);
  const [confirmPassword, setConfirmPassword] = useFormInput('', setFormError);

  const FIELDS_NOT_EMPTY = username && temporaryCode && password && confirmPassword;

  const RESET_PASSWORD_CONFIG_UPDATE = {
    username: {
      onChange: setUsername,
      value   : username
    },
    temporaryCode: {
      onChange: setTemporaryCode,
      value   : temporaryCode
    },
    password: {
      onChange: setPassword,
      value   : password
    },
    confirmPassword: {
      onChange: setConfirmPassword,
      value   : confirmPassword
    }
  };

  const { search } = location;
  const { token: routeToken } = queryString.parse(search);
  useEffect(() => {
    if (routeToken) {
      setToken(routeToken);
    }
  }, []);

  // custom rules for form validators
  ValidatorForm.addValidationRule(
    'isPasswordMatch', (value) => {
      const passwordMatch = confirmPassword === password;
      setFormError(passwordMatch ? '' : 'Please fill out the form');
      return passwordMatch;
    }
  );

  async function submitForgotPassword() {
    if (!FIELDS_NOT_EMPTY) return null;

    const submitResetPassword = await userAccount.resetPassword({
      username,
      password,
      token,
      resetCode: temporaryCode
    });

    if (!submitResetPassword.success) {
      const message = submitResetPassword.data || 'An error occured. Please check network connection';
      setError(_get(submitResetPassword, 'error.message', message));
      return false;
    }
    history.push(LOGIN_ROUTE);
    return true;
  }

  function handleErrorValidationOnSubmit(errors) {
    setFormError(_some(errors, 'state.isValid') ? '' : 'Please fill out the form');
  }

  let OUTPUT = (
    <RenderForm
      title='Forgot Password'
      onSubmit={submitForgotPassword}
      onError={errors => handleErrorValidationOnSubmit(errors)}
      fields={_merge({},
        RESET_PASSWORD_CONFIG,
        RESET_PASSWORD_CONFIG_UPDATE)}
      errorOutput={<FormError errorMessage={formError} formError={error} />}
      submitButton={(
        <SubmitButton
          pending={false}
          text='Send Password'
          disabled={false}
        />
      )}
    />
  );

  if (!routeToken) {
    OUTPUT = (
      <RenderForm
        title='Forgot Password'
        message={(
          <div>
            <Typography
              variant='body1'
              classes={{
                body1: classnames('body1_override')
              }}
            >
              You seem to be missing the validation token.
            </Typography>
            <Typography variant='body1'>
              Please double-check your URL and try again.
            </Typography>
          </div>
        )}
        onSubmit={() => history.push(FORGOT_PASSWORD)}
        onError={() => {}}
        fields={{}}
        errorOutput={<FormError errorMessage={formError} formError={error} />}
        submitButton={(
          <SubmitButton
            pending={false}
            text='Resend Password Email'
            disabled={false}
          />
        )}
      />
    );
  }

  return (
    <div className={classnames('root')}>
      <Paper className={classnames('container')}>
        {OUTPUT}
      </Paper>
    </div>
  );
}

export default withRouter(ResetPassword);
