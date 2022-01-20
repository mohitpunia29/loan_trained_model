import React from 'react';
import PropTypes from 'prop-types';

import { withRouter, Link } from 'react-router-dom';

import { Button, Typography } from '@material-ui/core';

import serviceRoutes from '../../constants/serviceRoutes';

import { get as getConfig } from '../../config/core';

import styles from './LoginChooseType.module.css';

function LoginChooseType({ history, location }) {
  const client = getConfig('modules.common.COMPANY_NAME');
  const title = getConfig('modules.auth.loginChooseType.title');
  const withVendorSelector = getConfig('modules.signup.variables.WITH_VENDOR_SELECTOR');
  const ssoUrl = getConfig('modules.signup.variables.SSO_URL');

  return (
    <div className={styles.root}>
      <main>
        <div className={styles.topContainer}>
          <Typography
            variant='h1'
            component='h1'
            classes={{ root: styles.title }}
          >
            {title}
          </Typography>
          <Typography
            variant='subtitle2'
            component='p'
            classes={{ root: styles.subtitle }}
          >
            Powered by Entefy
          </Typography>
        </div>
        <div className={styles.chooseTypeContainer}>
          {ssoUrl && (
            <ChooseTypeButton
              text='LOGIN WITH SSO'
              to={ssoUrl}
              self
              // disabled
            />
          )}
          <ChooseTypeButton
            text='or with an Entefy account'
            to={serviceRoutes.CLIENT_LOGIN_ROUTE}
            type={ssoUrl ? 'button2' : 'button'}
          />
          {withVendorSelector && (
            <ChooseTypeButton
              text='vendor'
              to={serviceRoutes.VENDOR_LOGIN_ROUTE}
            />
          )}
        </div>
      </main>
    </div>
  );
}

LoginChooseType.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.object
    })
  }).isRequired
};

export default withRouter(LoginChooseType);

function ChooseTypeButton({ text, to, self, type, disabled }) {
  return (
    <Button
      variant='contained'
      disabled={disabled}
      classes={{
        root: styles[!disabled ? type : 'disabled']
      }}
    >
      {self ? <a href={to} className={styles.buttonLabel} target='_self'>{text}</a> : (
        <Link className={styles.buttonLabel} to={to}>
          {`${text}`}
        </Link>
      )}
    </Button>
  );
}

ChooseTypeButton.propTypes = {
  text    : PropTypes.string.isRequired,
  to      : PropTypes.string.isRequired,
  self    : PropTypes.bool,
  type    : PropTypes.string,
  disabled: PropTypes.bool
};

ChooseTypeButton.defaultProps = {
  self    : false,
  type    : 'button',
  disabled: false
};
