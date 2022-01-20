import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import {
  Button,
  CircularProgress
} from '@material-ui/core';

import styles from './SubmitButton.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function SubmitButton({ text, onSubmit, disabled, pending }) {
  return (
    <Button
      color='primary'
      variant='contained'
      onClick={onSubmit}
      disabled={disabled}
    >
      <span>{text}</span>
      {pending && (
        <span className={classnames('spinner')}>
          <CircularProgress size={20} />
        </span>
      )}
    </Button>
  );
}

SubmitButton.propTypes = {
  text    : PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  pending : PropTypes.bool
};

SubmitButton.defaultProps = {
  text    : 'Submit',
  disabled: false,
  pending : false
};
