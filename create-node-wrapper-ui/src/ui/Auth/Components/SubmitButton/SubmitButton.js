import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import ProgressIcon from '../ProgressIcon/ProgressIcon';

export default function SubmitButton({ text, pending, disabled }) {
  return (
    <Button
      color='primary'
      variant='contained'
      type='submit'
      disabled={disabled}
    >
      {pending && <ProgressIcon />}
      {text}
    </Button>
  );
}

SubmitButton.propTypes = {
  text    : PropTypes.string.isRequired,
  pending : PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};
