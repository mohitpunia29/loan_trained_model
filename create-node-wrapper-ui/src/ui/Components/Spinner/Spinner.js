import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { CircularProgress } from '@material-ui/core';

import styles from './Spinner.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const SIZES = {
  small : 20,
  medium: 40,
  big   : 180
};

export default function Spinner({ size, colorClass, label }) {
  // named sizes
  if (SIZES[size]) {
    // eslint-disable-next-line no-param-reassign
    size = SIZES[size];
  }

  const thickness = size > 100 ? 1 : 4;

  return (
    <div className={classnames('root')}>
      <CircularProgress
        className={classnames(colorClass)}
        color='inherit'
        variant='indeterminate'
        size={size}
        thickness={thickness}
      />
      {label && (
        <div className={classnames('label')}>
          {label}
        </div>
      )}
    </div>
  );
}

Spinner.propTypes = {
  size      : PropTypes.oneOfType([PropTypes.oneOf(['small', 'medium', 'big']), PropTypes.number]),
  colorClass: PropTypes.string,
  label     : PropTypes.string
};

Spinner.defaultProps = {
  size      : 'medium',
  colorClass: 'main',
  label     : null
};
