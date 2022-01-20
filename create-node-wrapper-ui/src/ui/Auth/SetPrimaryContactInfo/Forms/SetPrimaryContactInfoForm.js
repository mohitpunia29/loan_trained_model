import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { some as _some, merge as _merge, isEqual as _isEqual } from 'lodash';
import bindClassnames from 'classnames/bind';

import { Avatar, Paper } from '@material-ui/core';
import PersonAdd from '@material-ui/icons/PersonAdd';

import { VERIFY_IDENTITY_FORM_CONFIG } from '../../config/fields';
import { REGEX_PATTERNS } from '../../../utils/regex';
import useFormInput from '../../Hooks/useFormInput/useFormInput';

import RenderForm from '../../Components/RenderForm/RenderForm';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import FormError from '../../Components/FormError/FormError';

import styles from './SetPrimaryContactInfoForm.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function SetPrimaryContactInfoForm({ onSubmit, errorMessage, emailValidator, unverifiedUserInfo }) {
  const { token, primaryContactInfo } = unverifiedUserInfo;

  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useFormInput(primaryContactInfo || '', setFormError);
  const [pendingFieldObj, setPendingFieldObj] = useState({
    email: { pending: false }
  });

  useEffect(() => {
    if (primaryContactInfo && !email) {
      setEmail(primaryContactInfo);
    }
  }, [primaryContactInfo, email]);

  const IS_EMAIL_THE_SAME = _isEqual(email, primaryContactInfo);

  const VERIFY_IDENTITY_FORM_CONFIG_UPDATE = {
    email: {
      onChange: setEmail,
      onBlur  : () => emailValidation(),
      value   : email
    }
  };

  function setPendingField(fieldName, flag, flow) {
    // we don't show text-field progress icons after submit pushed
    if (flow === 'submit') return null;
    setPendingFieldObj({ [fieldName]: { pending: flag } });
  }

  function handleErrorValidationOnSubmit(errors) {
    setFormError(_some(errors, 'state.isValid') ? '' : 'Please fill out the form');
  }

  async function emailValidation(flow) {
    // Resend confirmation email flow
    if (primaryContactInfo && IS_EMAIL_THE_SAME) return true;
    // prevent api validation if JS validation is not passed
    if (!email || !REGEX_PATTERNS.EMAIL.test(email)) return false;

    setPendingField('email', true, flow);
    const emailIsValid = await emailValidator(email);
    setPendingField('email', false, flow);

    if (emailIsValid.success && !emailIsValid.data.data.isAvailable) {
      setFormError(`Sorry ${email} is not available`);
      return false;
    }
    if (!emailIsValid.success && !emailIsValid.data) setFormError('Network error');
    return true;
  }

  const onFormSubmit = async (event) => {
    setPending(true);
    const IS_EMAIL_AVAILABLE = await emailValidation('submit');
    setPending(false);
    if (!IS_EMAIL_AVAILABLE) return null;

    let submitAction;

    setPending(true);
    if (primaryContactInfo && IS_EMAIL_THE_SAME) {
      submitAction = await onSubmit('resendVerificationEmail', { email, token });
    } else {
      submitAction = await onSubmit('emailSubmit', { email, token });
    }
    // pending update only if we haven't left the page
    if (!submitAction) setPending(false);

    return null;
  };

  const submitButtonText = `${IS_EMAIL_THE_SAME ? 'Resend' : 'Send'} Verification Email`;

  return (
    <div className={classnames('root')}>
      <Paper className={classnames('container')}>
        <Avatar className={classnames('logo')}>
          <PersonAdd />
        </Avatar>
        <RenderForm
          title={'Let\'s Verify Your Identity'}
          onSubmit={onFormSubmit}
          onError={errors => handleErrorValidationOnSubmit(errors)}
          fields={_merge({},
            VERIFY_IDENTITY_FORM_CONFIG,
            VERIFY_IDENTITY_FORM_CONFIG_UPDATE,
            pendingFieldObj)}
          errorOutput={<FormError errorMessage={errorMessage} formError={formError} />}
          submitButton={(
            <SubmitButton
              pending={pending}
              text={submitButtonText}
              disabled={pending || !email}
            />
          )}
        />
      </Paper>
    </div>
  );
}

SetPrimaryContactInfoForm.propTypes = {
  onSubmit          : PropTypes.func.isRequired,
  errorMessage      : PropTypes.string.isRequired,
  emailValidator    : PropTypes.func.isRequired,
  unverifiedUserInfo: PropTypes.shape({
    token             : PropTypes.string,
    primaryContactInfo: PropTypes.string
  }).isRequired
};
