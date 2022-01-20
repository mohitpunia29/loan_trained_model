import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';
import { endsWith as _endsWith } from 'lodash';
import uuid from 'uuid/v4';

import { FormControl, Input } from '@material-ui/core';

import { REGEX_PATTERNS } from '../../../constants/regex';

import styles from './Filename.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Filename({ filename, onChange, generateDefaultFilename, extension, minLength, onErrorChange, showDefault }) {
  const [defaultFilename] = useState(generateDefaultFilename(extension));
  const [error, setError] = useState();

  useEffect(() => {
    onErrorChange(Boolean(error));
  }, [error]);

  function handleChange(event) {
    const { value } = event.target;

    onChange(value);
  }

  // if showDefault is true, then we call onChange to pass the value to the
  useEffect(() => {
    validateFilename();

    // if the user deletes the filename but showDefault is set, we replace it with the defaultFilename
    if (!filename && showDefault) {
      onChange(defaultFilename);
    }
  }, [filename]);

  function validateFilename() {
    if (filename) {
      if (!REGEX_PATTERNS.ALPHANUM_AND_WHITESPACE.test(filename)) {
        setError('Special characters not allowed');
      } else if (!_endsWith(filename, extension)) {
        setError(`File extension must be ${extension}`);
      } else if (filename.length - extension.length < minLength) {
        setError(`Filename must be at least ${minLength} characters`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  }

  // if showDefault is true, then we call onChange to pass the value to the
  useEffect(() => {
    if (showDefault && !filename) {
      onChange(defaultFilename);
    } else if (filename === defaultFilename) {
      onChange('');
    }
  }, [showDefault]);

  return (
    <FormControl>
      <Input
        label='Filename'
        autoFocus
        classes={{
          root: classnames('input')
        }}
        value={filename}
        required
        type='text'
        placeholder={`Enter filename. Default: ${defaultFilename}`}
        id='fileName'
        onChange={handleChange}
      />
      <div className={classnames('inputValidation')}>
        {error ? <sup>{error}</sup> : <sup>&nbsp;</sup> }
      </div>
    </FormControl>
  );
}

Filename.propTypes = {
  filename               : PropTypes.string,
  onChange               : PropTypes.func.isRequired,
  generateDefaultFilename: PropTypes.func,
  minLength              : PropTypes.number,
  extension              : PropTypes.string,
  onErrorChange          : PropTypes.func.isRequired
}

Filename.defaultProps = {
  filename               : '',
  generateDefaultFilename: (extension) => {
    return `${uuid()}${extension}`;
  },
  minLength: 3,
  extension: '.txt'
};
