import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { FormGroup, Typography } from '@material-ui/core';
import { map as _map, filter as _filter } from 'lodash';

import TextField from '../TextField/TextField';
import styles from './RenderForm.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function RenderForm({
  title,
  message,
  onSubmit,
  onError,
  fields,
  errorOutput,
  submitButton
}) {
  let Title = null;
  if (title) {
    Title = (
      <Typography variant='h5'>
        {title}
      </Typography>
    );
  }

  return (
    <div className={classnames('root')}>
      {Title}
      {message}
      <ValidatorForm
        onSubmit={onSubmit}
        className={classnames('form')}
        onError={onError}
        instantValidate={false}
      >
        {_map(_filter(fields, (_item) => !_item.hide), (item, propName) => (
          <TextField
            key={propName}
            item={item}
            name={propName}
          />
        ))}
        <FormGroup className={classnames('buttonContainer')}>
          {errorOutput}
          {submitButton}
        </FormGroup>
      </ValidatorForm>
    </div>
  );
}

RenderForm.propTypes = {
  title       : PropTypes.string,
  message     : PropTypes.node,
  onSubmit    : PropTypes.func.isRequired,
  onError     : PropTypes.func.isRequired,
  fields      : PropTypes.shape({}).isRequired,
  errorOutput : PropTypes.node.isRequired,
  submitButton: PropTypes.node.isRequired
};

RenderForm.defaultProps = {
  message: null,
  title  : ''
};
