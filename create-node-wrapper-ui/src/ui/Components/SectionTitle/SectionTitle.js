import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { Typography } from '@material-ui/core';

import styles from './SectionTitle.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function SectionTitle({ title, description }) {
  return (
    <div className={classnames('root')}>
      <Typography
        variant='h1'
      >
        {title}
      </Typography>
      <Typography
        variant='body2'
        component='p'
      >
        {description}
      </Typography>
    </div>
  );
}

SectionTitle.propTypes = {
  title      : PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
