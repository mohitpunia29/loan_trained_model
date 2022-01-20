import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { FormControl, TextField } from '@material-ui/core';

import styles from './Textarea.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Textarea({ text, onChange, placeholder, rows, onErrorChange }) {
  const [error, setError] = useState();

  useEffect(() => {
    onErrorChange(Boolean(error));
  }, [error]);

  function handleChange(event) {
    const { value } = event.target;

    onChange(value);
  }

  return (
    <FormControl>
      <TextField
        autoFocus
        value={text}
        onChange={handleChange}
        rows={rows}
        classes={{ root: classnames('textarea') }}
        required
        type='text'
        placeholder={placeholder}
        multiline
        fullWidth
      />
      <div className={classnames('validation')}>
        {error ? <sup>{error}</sup> : <sup>&nbsp;</sup> }
      </div>
    </FormControl>
  )
}

Textarea.propTypes = {
  text         : PropTypes.string,
  onChange     : PropTypes.func.isRequired,
  placeholder  : PropTypes.string,
  rows         : PropTypes.number,
  onErrorChange: PropTypes.func.isRequired
};

Textarea.defaultProps = {
  text       : '',
  placeholder: 'Enter your text here',
  rows       : 14
};
