import React from 'react';
import bindClassnames from 'classnames/bind';
import { Typography } from '@material-ui/core';

import styles from './FormError.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function FormError({ errorMessage, formError }) {
  return (
    <Typography
      variant='body1'
      classes={{ root: classnames('error') }}
    >
      {errorMessage}
      {' '}
      {formError}
    </Typography>
  );
}
