import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import {
  Button,
  FormControl
} from '@material-ui/core';

import SubmitButton from '../SubmitButton/SubmitButton';

import styles from './ActionButtons.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ActionButtons({ onSubmit, isInputValid, hasInput, onClear, requestPending, submitText, clearText }) {
  return (
    <FormControl className={classnames('root')}>
      <FormControl className={classnames('wrapper')}>
        <SubmitButton
          text={submitText}
          onSubmit={onSubmit}
          disabled={!isInputValid || requestPending || !hasInput}
          pending={requestPending}
        />
      </FormControl>
      <FormControl className={classnames('wrapper')}>
        <Button
          color='default'
          variant='contained'
          onClick={onClear}
          disabled={!hasInput || requestPending}
        >
          {clearText}
        </Button>
      </FormControl>
    </FormControl>
  );
}

ActionButtons.propTypes = {
  onSubmit      : PropTypes.func.isRequired,
  hasInput      : PropTypes.bool,
  isInputValid  : PropTypes.bool,
  onClear       : PropTypes.func.isRequired,
  requestPending: PropTypes.bool,
  submitText    : PropTypes.string,
  clearText     : PropTypes.string
};

ActionButtons.defaultProps = {
  submitText    : 'Submit',
  clearText     : 'Clear Data',
  hasInput      : false,
  isInputValid  : true,
  requestPending: false
};
