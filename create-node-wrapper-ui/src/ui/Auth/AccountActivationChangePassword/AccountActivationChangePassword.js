import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { some as _some, get as _get, merge as _merge, map as _map, startCase as _startCase } from 'lodash';
import bindClassnames from 'classnames/bind';
import { Typography, Paper, FormControl, TextField } from '@material-ui/core';

import { ConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';
import serviceRoutes from '../../constants/serviceRoutes';
import * as userAccount from '../../utils/userAccount';
import coreConfig from '../../config/core';
import { NEW_PASSWORD_CONFIG } from '../config/fields';
import useFormInput from '../Hooks/useFormInput/useFormInput';

import RenderForm from '../Components/RenderForm/RenderForm';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import FormError from '../Components/FormError/FormError';

import styles from './AccountActivationChangePassword.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

function AccountActivationChangePassword({ history, location, closeModal }) {
  const { enqueueSnackbar } = useSnackbar();
  const configContext = useContext(ConfigContext);
  const userData = configContext.getUserByModule();
  const { authToken } = userData.authInfo;
  const { username, firstName, lastName } = _get(userData, 'authInfo.profile', {});
  const [formError, setFormError] = useState('');

  const [currentPassword, setCurrentPassword] = useFormInput('', setFormError);
  const [newPassword, setNewPassword] = useFormInput('', setFormError);
  const [confirmPassword, setConfirmPassword] = useFormInput('', setFormError);
  const [pending, setPending] = useState(false);

  const NEW_PASSWORD_CONFIG_UPDATE = {
    currentPassword: {
      onChange: setCurrentPassword,
      value   : currentPassword
    },
    newPassword: {
      onChange: setNewPassword,
      value   : newPassword
    },
    confirmPassword: {
      onChange: setConfirmPassword,
      value   : confirmPassword
    }
  };

  function handleErrorValidationOnSubmit(errors) {
    setFormError(_some(errors, 'state.isValid') ? '' : 'Please fill out the form');
  }

  // custom rules for form validators
  ValidatorForm.addValidationRule(
    'isPasswordMatch', (value) => {
      const passwordMatch = confirmPassword === newPassword;
      setFormError(passwordMatch ? '' : 'Please fill out the form');

      return passwordMatch;
    }
  );

  const onFormSubmit = async (event) => {
    setPending(true);
    const changePassword = await userAccount.changePassword({
      newPassword,
      currentPassword,
      username,
      authToken
    });
    setPending(false);

    if (!changePassword.success) {
      const message = changePassword.data || 'Account activation error 1. Check network connection';
      setFormError(_get(changePassword, 'error.message', message));

      return false;
    }

    sessionStorage.setItem('passwordChanged', 'true');
    enqueueSnackbar('The password was changed successfully', {
      variant: 'success'
    });

    if (coreConfig.features.authWelcomePage && !configContext.isOnboarded()) {
      history.push(serviceRoutes.WELCOME);
    } else {
      history.push(location.state ? location.state.from : '/');
      closeModal();
    }
  };

  const userInfo = {
    username,
    firstName,
    lastName
  };

  return (
    <div className={classnames('root')}>
      <Paper className={classnames('container')}>
        <div className={classnames('message')}>
          <Typography variant='h5'>
            Change password
          </Typography>
          <UserInfo
            info={userInfo}
          />
        </div>
        <RenderForm
          onSubmit={onFormSubmit}
          onError={(errors) => handleErrorValidationOnSubmit(errors)}
          fields={_merge({},
            NEW_PASSWORD_CONFIG,
            NEW_PASSWORD_CONFIG_UPDATE)}
          errorOutput={<FormError errorMessage='' formError={formError} />}
          submitButton={(
            <SubmitButton
              pending={pending}
              text='Change password'
              disabled={pending || !newPassword || !confirmPassword}
            />
          )}
        />
      </Paper>
    </div>
  );
}

AccountActivationChangePassword.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.object
    })
  }).isRequired,
  closeModal: PropTypes.func
};

AccountActivationChangePassword.defaultProps = {
  closeModal: () => {}
};

export default withRouter(AccountActivationChangePassword);

function UserInfo({ info }) {
  return (
    <FormControl className={classnames('userInfo__root')}>
      {_map(info, (value = '', label) => ( // = '' avoid error about changing from controlled to uncontrolled component
        <TextField
          key={label}
          disabled
          classes={{ root: classnames('userInfo__field') }}
          label={_startCase(label)}
          value={value}
        />
      ))}
    </FormControl>
  );
}

UserInfo.propTypes = {
  info: PropTypes.shape({
    username : PropTypes.string,
    firstName: PropTypes.string,
    lastName : PropTypes.string
  }).isRequired
};
