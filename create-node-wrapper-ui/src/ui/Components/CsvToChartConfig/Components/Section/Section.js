import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { Typography } from '@material-ui/core';

import styles from './Section.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Section({ title, children }) {
  return (
    <section
      className={classnames('root')}
    >
      {title && (
        <Typography
          variant='h6'
          align='left'
          gutterBottom
        >
          {title}
        </Typography>
      )}
      {children}
    </section>
  );
}

Section.propTypes = {
  title   : PropTypes.string,
  children: PropTypes.node.isRequired
};

Section.defaultProps = {
  title: undefined
};
