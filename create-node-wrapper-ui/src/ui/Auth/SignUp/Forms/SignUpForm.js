import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { some as _some, merge as _merge, reduce as _reduce, pick as _pick, isNull as _isNull } from 'lodash';
import bindClassnames from 'classnames/bind';

import {
  Avatar, Paper,
  Typography, Link
} from '@material-ui/core';

import Select from 'react-select';


import PersonAdd from '@material-ui/icons/PersonAdd';
import { NavLink } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { get as getConfig } from '../../../config/core';

import { SIGN_UP_FORM_CONFIG } from '../../config/fields';
import serviceRoutes from '../../../constants/serviceRoutes';
import { randomPassword } from '../../utils/signFlowUtils';
import useFormInput from '../../Hooks/useFormInput/useFormInput';

import RenderForm from '../../Components/RenderForm/RenderForm';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import FormError from '../../Components/FormError/FormError';

import styles from './SignUpForm.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const { LOGIN_ROUTE } = serviceRoutes;
const withoutPassword = getConfig('modules.signup.variables.WITHOUT_PASSWORD_FIELDS');

const USER_TYPE = [
  {
    label: getConfig('modules.common.COMPANY_NAME'),
    value: 'client'
  }
];

export default function SignUpForm({ onSubmit, errorMessage, usernameValidator }) {
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState('');

  const [firstname, setFirstname] = useFormInput('', setFormError);
  const [lastname, setLastname] = useFormInput('', setFormError);
  const [username, setUsername] = useFormInput('', setFormError);
  const [password, setPassword] = useFormInput('', setFormError);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('client');
  const [team, setTeam] = useState();

  useState(() => {
    if (userType === 'client') setTeam('');
  }, [userType]);

  const SIGN_UP_FORM_CONFIG_UPDATE = _pick({
    firstname: {
      onChange: setFirstname,
      value   : firstname
    },
    lastname: {
      onChange: setLastname,
      value   : lastname
    },
    userType: {
      onChange: e => setUserType(e.target.value),
      value   : userType,
      enum    : USER_TYPE
    },
    username: {
      onChange: setUsername,
      onBlur  : () => userNameValidation(),
      value   : username
    },
    password: {
      onChange: setPassword,
      value   : password
    },
    confirmPassword: {
      onChange: e => setConfirmPassword(e.target.value),
      value   : confirmPassword
    }
  }, Object.keys(SIGN_UP_FORM_CONFIG));

  const [pendingFieldObj, setPendingFieldObj] = useState(_reduce(
    SIGN_UP_FORM_CONFIG_UPDATE, (result, value, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = { pending: false };
      return result;
    },
    {}
  ));

  const requiriedFields = { firstname, lastname, username, password, confirmPassword };
  if (withoutPassword) {
    delete requiriedFields.password;
    delete requiriedFields.confirmPassword;
  }
  const ARE_FIELDS_MISSING = _some(Object.keys(requiriedFields), key => !requiriedFields[key]);

  const SUBMIT_BUTTON_DISABLED = Boolean(formError || ARE_FIELDS_MISSING || pending);

  // custom rules for form validators
  ValidatorForm.addValidationRule(
    'isPasswordMatch', (value) => {
      const passwordMatch = confirmPassword === password;
      setFormError(passwordMatch ? '' : 'Please fill out the form');
      return passwordMatch;
    }
  );

  function setPendingField(fieldName, flag, flow) {
    // we don't show text-field progress icons after submit pushed
    if (flow === 'submit') return null;
    setPendingFieldObj({ ...pendingFieldObj, [fieldName]: { pending: flag } });
  }

  function handleErrorValidationOnSubmit(errors) {
    setFormError(_some(errors, 'state.isValid') ? '' : 'Please fill out the form');
  }

  const userNameValidation = async (flow) => {
    if (!username || username.length < 3) return false;

    setPendingField('username', true, flow);
    const usernameIsValid = await usernameValidator(username);
    setPendingField('username', false, flow);

    if (usernameIsValid.success && !usernameIsValid.data.data.isAvailable) {
      setFormError(`Sorry, username '${username}' is not available`);
      return false;
    }
    if (!usernameIsValid.success && !usernameIsValid.data) setFormError('Network error');
    return true;
  };

  const onFormSubmit = async (event) => {
    setPending(true);

    if (!userNameValidation('submit')) {
      setPending(false);
      return null;
    }

    const submitAction = await onSubmit({
      firstname,
      lastname,
      username,
      // userType,
      // team,
      // When signup.WITHOUT_PASSWORD_FIELDS is false, the user isn't asked to provide one, so we create a random one to be compliant with the API
      password: !SIGN_UP_FORM_CONFIG.password ? randomPassword() : password
    });
    // pending update only if we haven't left the page
    if (!submitAction) setPending(false);

    return null;
  };

  return (
    <div className={classnames('root')}>
      <Paper className={classnames('container')}>
        <Avatar className={classnames('logo')}>
          <PersonAdd />
        </Avatar>
        <RenderForm
          title='Create New Account'
          onSubmit={onFormSubmit}
          onError={(errors) => handleErrorValidationOnSubmit(errors)}
          fields={_merge({},
            SIGN_UP_FORM_CONFIG,
            SIGN_UP_FORM_CONFIG_UPDATE,
            pendingFieldObj)}
          errorOutput={<FormError errorMessage={errorMessage} formError={formError} />}
          submitButton={(
            <SubmitButton
              pending={pending}
              text='Sign up'
              disabled={SUBMIT_BUTTON_DISABLED}
            />
          )}
        />
        <Typography
          variant='body1'
          classes={{ root: classnames('signUpLink') }}
        >
          Already have an account?
          {' '}
          <Link
            className={classnames('defaultButton')}
            color='primary'
            component={NavLink}
            to={LOGIN_ROUTE}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </div>
  );
}

SignUpForm.propTypes = {
  onSubmit         : PropTypes.func.isRequired,
  errorMessage     : PropTypes.string.isRequired,
  usernameValidator: PropTypes.func.isRequired
};
