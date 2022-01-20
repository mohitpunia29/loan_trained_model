import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { FormControl, FormLabel } from '@material-ui/core';

import styles from './OptionWrapper.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function OptionWrapper({ name, isRequired, children }) {
  return (
    <FormControl
      component='fieldset'
      classes={{ root: classnames('root') }}
    >
      <FormLabel
        classes={{ root: classnames('title') }}
      >
        {name}
      </FormLabel>
      <div className={classnames('option')}>
        {children}
      </div>
    </FormControl>
  );
}

OptionWrapper.propTypes = {
  name      : PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  children  : PropTypes.node.isRequired
};

OptionWrapper.defaultProps = {
  isRequired: false
};
