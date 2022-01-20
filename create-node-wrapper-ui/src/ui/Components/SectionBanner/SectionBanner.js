import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { Typography } from '@material-ui/core';

import styles from './SectionBanner.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function SectionBanner({ title, logo, alt }) {
  return (
    <Typography
      variant='h1'
      classes={{ root: classnames('root') }}
    >
      <div>{title}</div>
      {logo && (
        <div className={classnames('company-logo')}>
          <img src={logo} alt={alt || 'logo'} />
        </div>
      )}
    </Typography>
  );
}

SectionBanner.propTypes = {
  title: PropTypes.string.isRequired,
  logo : PropTypes.string,
  alt  : PropTypes.string
};

SectionBanner.defaultProps = {
  logo: undefined,
  alt : undefined
}
