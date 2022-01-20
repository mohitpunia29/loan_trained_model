import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { TextValidator } from 'react-material-ui-form-validator';
import { MenuItem } from '@material-ui/core';

import bindClassnames from 'classnames/bind';

import ProgressIcon from '../ProgressIcon/ProgressIcon';

import styles from './TextField.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function TextField({ item, name }) {
  const inputEl = useRef(null);

  const handleBlur = (event) => {
    const { name: fieldName, value } = event.currentTarget;
    if (fieldName === name) {
      // set true as second parameter to onBlur required validation
      inputEl.current.validate(value);
    }
  };

  return (
    <div className={classnames('root')}>
      <TextValidator
        ref={inputEl}
        key={item.label}
        value={item.value}
        name={name}
        label={item.label}
        type='text'
        // select={!!item.enum}
        classes={{ root: classnames('inputField') }}
        onChange={item.onChange}
        validators={item.validators}
        errorMessages={item.errorMessages}
        value={item.value}
        InputLabelProps={{ shrink: item.enum }}
        onBlur={(e) => {
          // api validation if it presents
          if (item.onBlur) item.onBlur();
          // js validation
          handleBlur(e);
        }}
      >
        {/* {item.enum ? item.enum.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        )) : ''} */}
      </TextValidator>
      {item.pending && <ProgressIcon />}
    </div>
  );
}

TextField.propTypes = {
  item: PropTypes.shape({
    label        : PropTypes.string.isRequired,
    onChange     : PropTypes.func.isRequired,
    validators   : PropTypes.array.isRequired,
    errorMessages: PropTypes.array.isRequired,
    value        : PropTypes.string.isRequired
  }).isRequired,
  name: PropTypes.string.isRequired
};
