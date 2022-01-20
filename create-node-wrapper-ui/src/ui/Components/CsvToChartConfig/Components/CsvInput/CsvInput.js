import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';
import papaparse from 'papaparse';

import { TextField } from '@material-ui/core';

import styles from './CsvInput.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function CsvInput({ csv, setCsv }) {
  function handleOnChange(event) {
    const { value } = event.target;

    // convenient way to always have a comma separated csv
    setCsv(papaparse.unparse(papaparse.parse(value)));
  }

  return (
    <TextField
      classes={{ root: classnames('root') }}
      placeholder='Paste the csv document'
      rows={15}
      value={csv}
      multiline
      onChange={handleOnChange}
    />
  );
}

CsvInput.propTypes = {
  csv   : PropTypes.string.isRequired,
  setCsv: PropTypes.func.isRequired
};
