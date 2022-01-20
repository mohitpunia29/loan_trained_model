import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import {
  FormControlLabel,
  Radio, RadioGroup
} from '@material-ui/core';

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
      aria-label='boolean'
      name='boolean'
      value={value ? 'true' : 'false'}
      onChange={handleChange}
    >
      <FormControlLabel
        value='true'
        classes={{ root: classnames('label') }}
        control={<Radio classes={{ root: classnames('radio')}} />}
        label='Show'
      />
      <FormControlLabel
        value='false'
        classes={{ root: classnames('label') }}
        control={<Radio classes={{ root: classnames('radio')}} />}
        label='Hide'
      />
    </RadioGroup>
  );
}

Boolean.propTypes = {
  value   : PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
