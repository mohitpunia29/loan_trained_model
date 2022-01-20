import React from 'react';
import bindClassnames from 'classnames/bind';
import { CircularProgress } from '@material-ui/core';

import styles from './ProgressIcon.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ProgressIcon() {
  return (
    <CircularProgress
      color='secondary'
      classes={{ root: classnames('root') }}
    />
  );
}
