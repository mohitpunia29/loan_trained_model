/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { some as _some, merge as _merge } from 'lodash';
import { NavLink } from 'react-router-dom';
import { Avatar, Paper, Typography, Dialog, Link } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import coreConfig, { get as getConfig } from '../../../config/core';

import { LOGIN_CONFIG } from '../../config/fields';
import serviceRoutes from '../../../constants/serviceRoutes';
import useFormInput from '../../Hooks/useFormInput/useFormInput';
import FormError from '../../Components/FormError/FormError';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import RenderForm from '../../Components/RenderForm/RenderForm';
import TermsOfUse from '../../Components/TermsAndPrivacy/TermsOfUse';
import Privacy from '../../Components/TermsAndPrivacy/Privacy';

import styles from './LoginForm.module.css';

const signup = getConfig('modules.signup.variables');

const { features } = coreConfig || { features: {} };
const { SIGN_UP_ROUTE, FORGOT_PASSWORD } = serviceRoutes;

export default function LoginForm({ onSubmit, errorMessage, name }) {
  const [formError, setFormError] = useState('');
  const [username, setUsername] = useFormInput('', setFormError);
  const [password, setPassword] = useFormInput('', setFormError);
  const [pending, setPending] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  // const [error, setError] = useState(authError);
  const FIELDS_ARE_EMPTY = !(username && password);
  // const SUBMIT_BUTTON_DISABLED = !errorMessage && (!FIELDS_NOT_EMPTY || pending);
  const SUBMIT_BUTTON_DISABLED = FIELDS_ARE_EMPTY || pending;

  const LOGIN_CONFIG_UPDATE = {
    username: {
      onChange: setUsername,
      value   : username
    },
    password: {
      onChange: setPassword,
      value   : password
    }
  };

  function handleErrorValidationOnSubmit(errors) {
    setFormError(_some(errors, 'state.isValid') ? '' : 'Please fill out the form');
  }

  const submitLogin = async (event) => {
    if (FIELDS_ARE_EMPTY) return null;

    setPending(true);
    const submitAction = await onSubmit({ username, password });
    // pending update only if we haven't left the page
    if (!submitAction) setPending(false);
  };

  return (
    <div className={styles.main}>
      <Paper className={styles.container}>
        <Avatar className={styles.logo}>
          <LockOutlinedIcon />
        </Avatar>
        <RenderForm
          title={`${name ? `${name} ` : ''}Login`}
          onSubmit={submitLogin}
          onError={(errors) => handleErrorValidationOnSubmit(errors)}
          fields={_merge({},
            LOGIN_CONFIG,
            LOGIN_CONFIG_UPDATE)}
          errorOutput={<FormError errorMessage={errorMessage} formError={formError} />}
          submitButton={(
            <SubmitButton
              pending={pending && !errorMessage}
              text='Sign in'
              disabled={SUBMIT_BUTTON_DISABLED}
            />
          )}
        />
        <div>
          {!signup.WITHOUT_PASSWORD_CHANGE && (
            <Typography
              variant='body1'
              classes={{ root: styles.signUpLink }}
            >
              <Link
                component={NavLink}
                to={FORGOT_PASSWORD}
              >
                Forgot password?
              </Link>
            </Typography>
          )}
          {features.signUp && (
            <Typography
              variant='body1'
              classes={{ root: styles.signUpLink }}
            >
              {'Don\'t have an account?'}
              {' '}
              <Link
                component={NavLink}
                to={SIGN_UP_ROUTE}
              >
                Sign up
              </Link>
            </Typography>
          )}
          <Typography
            variant='caption'
            classes={{ root: styles.disclaimer }}
          >
            {'By clicking Sign In, you agree to Entefy\'s '}
            <a href='https://www.entefy.com/privacy' target='_blank' style={{ textDecoration: 'none' }}>
              <span
                role='button'
                tabIndex={0}
                className={styles.link}
                // onClick={() => setOpenPrivacy(true)}
              >
                Privacy
              </span>
            </a>
            {' policy and '}
            <a href='https://www.entefy.com/acceptable-use-policy' target='_blank' style={{ textDecoration: 'none' }}>
              <span
                role='button'
                tabIndex={0}
                className={styles.link}
                // onClick={() => setOpenPrivacy(true)}
              >
                Acceptable Use Policy
              </span>
            </a>
            {/* <span
              role='button'
              tabIndex={0}
              className={styles.link}
              onClick={() => setOpenPrivacy(true)}
            >
              Privacy Policy
            </span>
            {' and '}
            <span
              role='button'
              tabIndex={1}
              className={styles.link}
              onClick={() => setOpenTerms(true)}
            >
              Terms of Use
            </span> */}
            <Dialog
              open={openTerms}
              maxWidth='lg'
              onClose={() => setOpenTerms(false)}
            >
              <TermsOfUse />
            </Dialog>
            <Dialog
              open={openPrivacy}
              onClose={() => setOpenPrivacy(false)}
            >
              <Privacy />
            </Dialog>
          </Typography>
        </div>
      </Paper>
    </div>
  );
}

LoginForm.propTypes = {
  onSubmit    : PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  name        : PropTypes.string
};

LoginForm.defaultProps = {
  name: undefined
};
