import React, { useState } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';
import { Button, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { REGEX_PATTERNS } from '../../../../utils/regex';
import { useConfigContext } from '../../../../Providers/ConfigProvider/ConfigProvider';
import Spinner from '../../../../Components/Spinner/Spinner';

import { contactSupport } from '../../../../utils/technicalSupport';

import styles from './TechnicalSupportForm.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function TechnicalSupportForm({ closeModal }) {
  const configContext = useConfigContext('fileStore');
  const { isAuthenticated, state: { user } } = configContext;
  const { authInfo: { profile } } = user;
  const { enqueueSnackbar } = useSnackbar();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState(profile ? profile.username : '');
  const [sending, setSending] = useState(false);

  function isEmailValid() {
    // no validation while the field is empty
    if (!from) return true;

    // no validation when the user is already authenticated.
    // based on the assumption that username will be an email, we accept that assumption
    if (isAuthenticated()) return true;

    return REGEX_PATTERNS.EMAIL.test(from);
  }

  function send() {
    setSending(true);
    contactSupport({
      from,
      subject,
      text: message
    })
      .then((response) => {
        setSending(false);
        closeModal();
        if (response.success) {
          enqueueSnackbar('Your message was sent. We will contact you shortly.', { variant: 'success' });
        } else {
          // eslint-disable-next-line no-console
          console.log('Contact Support error:', response.data);
          enqueueSnackbar('We are experiencing some technical issues. Please try again later.', { variant: 'error' });
        }
      })
      .catch((response) => {
        setSending(false);
        // eslint-disable-next-line no-console
        console.log('Contact Support error', response);
      });
  }
  return (
    <form className={classnames('root')} noValidate autoComplete='off'>
      <TextField
        label={isAuthenticated() ? 'Username' : 'enter your email address'}
        type='email'
        name='email'
        autoComplete='email'
        helperText={!isEmailValid() ? 'Please fill in a valid email address' : null}
        error={!isEmailValid()}
        disabled={isAuthenticated()}
        fullWidth
        className={classnames('from')}
        value={from}
        onChange={e => setFrom(e.target.value)}
        margin='normal'
        variant='outlined'
      />
      <TextField
        label='Subject'
        fullWidth
        className={classnames('subject')}
        value={subject}
        onChange={e => setSubject(e.target.value)}
        margin='normal'
        variant='outlined'
      />
      <TextField
        label='Message'
        fullWidth
        multiline
        rows='5'
        value={message}
        onChange={e => setMessage(e.target.value)}
        className={classnames('message')}
        margin='normal'
        variant='outlined'
      />
      <div className={classnames('buttonContainer')}>
        <Button
          disableRipple
          disableFocusRipple
          variant='contained'
          classes={{ root: classnames('button', 'cancel') }}
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          disabled={!message || !subject || !from || sending || !isEmailValid()}
          disableRipple
          disableFocusRipple
          variant='contained'
          color='secondary'
          classes={{ root: classnames('button', 'submit') }}
          onClick={send}
        >
          <span>Submit</span>
          {sending && <Loading />}
        </Button>
      </div>
    </form>
  );
}

TechnicalSupportForm.propTypes = {
  closeModal: PropTypes.func.isRequired
};

function Loading() {
  return (
    <span className={classnames('loading')}>
      <Spinner size='small' />
    </span>
  );
}
