import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import bindClassnames from 'classnames/bind';
import Close from '../Icons/Close';

import styles from './ErrorModal.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ErrorModal({ open, message, closeModal }) {
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      className={classnames('confirmation-dialog')}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      maxWidth="md"
    >
      <DialogTitle
        id="confirmation-dialog-title"
        classes={{ root: classnames('title') }}
      >
        {/* Error */}
        <CloseIcon onClose={closeModal} />
      </DialogTitle>
      <DialogContent>{message ? message : 'Unknown error'}</DialogContent>
    </Dialog>
  );
}

ErrorModal.propTypes = {
  open      : PropTypes.bool.isRequired,
  message   : PropTypes.string,
  closeModal: PropTypes.func.isRequired
};

ErrorModal.defaultProps = {
  message: ''
};

function CloseIcon({ onClose }) {
  return <Close className={classnames('closeIcon')} onClick={onClose} />;
};

CloseIcon.propTypes = {
  onClose: PropTypes.func.isRequired
};
