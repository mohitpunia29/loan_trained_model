import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import bindClassnames from 'classnames/bind';
import Close from '../../../../Components/Icons/Close';
import AccountActivationChangePassword from '../../../../Auth/AccountActivationChangePassword/AccountActivationChangePassword';

import styles from './ChangePasswordModal.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ChangePasswordModal({ open, closeModal }) {
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      className={classnames('confirmation-dialog')}
      aria-labelledby='confirmation-dialog-title'
      onBackdropClick={closeModal}
      open={open}
      maxWidth='md'
    >
      <DialogTitle
        id='confirmation-dialog-title'
        classes={{ root: classnames('title') }}
      >
        {/* Error */}
        <Close
          className={classnames('closeIcon')}
          onClick={closeModal}
        />
      </DialogTitle>
      <DialogContent
        classes={{
          root: classnames('rootOverride')
        }}
      >
        <AccountActivationChangePassword closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

ChangePasswordModal.propTypes = {
  open      : PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};
