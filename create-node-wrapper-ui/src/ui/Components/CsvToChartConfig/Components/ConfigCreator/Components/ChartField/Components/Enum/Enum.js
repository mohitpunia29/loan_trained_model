import React from 'react';
import PropTypes from 'prop-types';
import { map as _map } from 'lodash';
import bindClassnames from 'classnames/bind';

import { FormControl, Input, MenuItem, Select } from '@material-ui/core';

import styles from './Enum.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Enum({ enumValues, value, onChange }) {
  function handleChange(event) {
    const { value: newVal } = event.target;

    onChange(newVal);
  }

  console.log({ enumValues, value });

  return (
    <FormControl>
      <Select
        value={value}
        onChange={handleChange}
        classes={{
          select: classnames('label'),
          icon  : classnames('label')
        }}
        input={<Input disableUnderline />}
      >
        {_map(enumValues, val => (
          <MenuItem
            key={val}
            value={val}
          >
            {val}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

Enum.propTypes = {
  enumValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  value     : PropTypes.string.isRequired,
  onChange  : PropTypes.func.isRequired
};
