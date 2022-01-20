import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

import styles from './Boolean.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Boolean({ value, onChange }) {
  function handleChange(event) {
    const { value: val } = event.target;

    onChange(val === 'true');
  }

  return (
    <RadioGroup
      row
      classes={{ root: classnames('root') }}
      aria-label='boolean'
      name='boolean'
      value={value ? 'true' : 'false'}
      onChange={handleChange}
    >
      <FormControlLabel
        labelPlacement='start'
        value='true'
        classes={{ label: classnames('label') }}
        control={<Radio classes={{ root: classnames('label') }} />}
        label='On'
      />
      <FormControlLabel
        value='false'
        classes={{ label: classnames('label') }}
        control={<Radio classes={{ root: classnames('label') }} />}
        label='Off'
      />
    </RadioGroup>
  );
}

Boolean.propTypes = {
  value   : PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

Boolean.defaultProps = {
  value: false
};
