/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import bindClassnames from 'classnames/bind';
import { useSnackbar } from 'notistack';

import { Typography, Button, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';

import { get as getConfig } from '../../config/core';
import { useConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';
import * as userAccount from '../../utils/userAccount';

import TermsOfUse from '../Components/TermsAndPrivacy/TermsOfUse';
import terms from './terms.json';

import styles from './Welcome.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const { COMPANY_NAME } = getConfig('modules.common', {});

function Welcome({ history }) {
  const { enqueueSnackbar } = useSnackbar();
  const configContext = useConfigContext('fileStore');
  const { state: { user }, onActiveUserDataChange } = configContext;
  const { authInfo: { authToken } } = user;

  const [termsSelection, setTermsSelection] = useState(false);

  /**
   * Onboarding user
   */
  async function handleOnboard() {
    // onboard request
    const onboardResponse = await userAccount.onboard(authToken);

    if (!onboardResponse.success) {
      displayErrorMessage(onboardResponse.data || 'VPN error. Check network connection');
    } else {
      onActiveUserDataChange('fileStore', {
        ...user,
        authInfo: {
          ...user.authInfo,
          isOnboarded: true
        }
      });

      history.push('/');
    }
  }

  /**
   * Wrapper around the enqueueSnackbar function to make sure all the messages have the same behavior
   *
   * @param {String} message
   */
  function displayErrorMessage(message) {
    enqueueSnackbar(message, { variant: 'error' });
  }

  return (
    <div className={classnames('root')}>
      <div className={classnames('welcomeContainer')}>
        <Typography
          variant='h1'
          component='h1'
          classes={{
            h1: classnames('title')
          }}
        >
          Congratulations!
        </Typography>
        <Typography
          variant='h6'
          component='h6'
          classes={{
            h6: classnames('subtitle')
          }}
        >
          You’ve successfully activated your Entefy account.
        </Typography>
        <Typography
          variant='body1'
          component='div'
          classes={{ body1: classnames('main') }}
        >
          {terms.map((term) => {
            if (term.paragraphs) {
              return term.paragraphs.map((paragraph) => (
                <p className={classnames('paragraph')}>
                  {paragraph.replace(/{COMPANY_NAME}/g, COMPANY_NAME)}
                </p>
              ));
            }
            if (term.list) {
              return (
                <ul>
                  {(term.list.map((item) => (
                    <li>
                      {item.replace(/{COMPANY_NAME}/g, COMPANY_NAME)}
                    </li>
                  )))}
                </ul>
              );
            }
            if (term.paragraphs2) {
              return term.paragraphs2.map((paragraph) => (
                <p className={classnames('paragraph')}>
                  {paragraph.replace(/{COMPANY_NAME}/g, COMPANY_NAME)}
                </p>
              ));
            }
          })}
          <p className={classnames('paragraph')}>
            Feel free to <a href='mailto:support@entefy.com'>contact us</a> with any questions. We're here to help!
          </p>
          <p className={classnames('paragraph')}>
          Thank you,
          </p>
          <p className={classnames('paragraph')}>
          Entefy Support Team
          </p>
        </Typography>

        <div className={classnames('terms')}>
          <TermsOfUse height={400} />
        </div>
        <FormGroup row>
          <FormControlLabel
            control={(
              <Checkbox
                checked={termsSelection}
                onChange={() => setTermsSelection(!termsSelection)}
                color='primary'
              />
            )}
            label='I acknowledge that I have read and understand the above User Notice.'
          />
        </FormGroup>
        <Button
          variant='contained'
          color='secondary'
          disabled={!termsSelection}
          disableRipple
          disableFocusRipple
          classes={{ root: classnames('getStarted') }}
          onClick={handleOnboard}
        >
          GET STARTED!
        </Button>
        <div className={classnames('empty')} />
      </div>
    </div>
  );
}

Welcome.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withRouter(Welcome);
