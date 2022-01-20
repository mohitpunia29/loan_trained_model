import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import bindClassnames from 'classnames/bind';

import TechnicalSupportForm from './TechnicalSupportForm';

import styles from './TechnicalSupportModal.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function TechnicalSupportModal({ open, closeModal }) {
  return (
    <Dialog
      className={classnames('root')}
      aria-labelledby='confirmation-dialog-title'
      onBackdropClick={closeModal}
      onEscapeKeyDown={closeModal}
      open={open}
      maxWidth='md'
    >
      <DialogTitle
        id='confirmation-dialog-title'
        classes={{ root: classnames('title') }}
        disableTypography
      >
        <Typography
          variant='h5'
        >
          Technical Support Form
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TechnicalSupportForm
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
}

TechnicalSupportModal.propTypes = {
  open      : PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};
