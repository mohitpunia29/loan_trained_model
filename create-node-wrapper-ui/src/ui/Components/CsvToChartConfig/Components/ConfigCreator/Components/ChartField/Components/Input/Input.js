import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray } from 'lodash';
import bindClassnames from 'classnames/bind';

import { FormControl, TextField } from '@material-ui/core';

import styles from './Input.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Input({ value, type, onChange }) {
  function handleChange(event) {
    let { value: val } = event.target;

    if (type === 'number') {
      val = parseInt(val);
    }

    onChange(val);
  }

  if (type === 'string' || _isArray(type)) {
    type = 'text';
  }

  return (
    <FormControl>
      <TextField
        value={value}
        onChange={handleChange}
        type={type}
        InputProps={{
          disableUnderline: true,
          classes: {
            input: classnames('input')
          }
        }}
      />
    </FormControl>
  );
}

Input.propTypes = {
  type    : PropTypes.oneOfType([PropTypes.oneOf(['string', 'number']), PropTypes.array]),
  value   : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired
};

Input.defaultProps = {
  type : 'string',
  value: ''
};
