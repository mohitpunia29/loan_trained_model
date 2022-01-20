import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { Typography } from '@material-ui/core';

import Boolean from './Components/Boolean/Boolean';
import Colors from './Components/Colors/Colors';
import DropCsvColumn from './Components/DropCsvColumn/DropCsvColumn';
import Enum from './Components/Enum/Enum';
import Input from './Components/Input/Input';

import style from '../../../../../../config/style';

import styles from './ChartField.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ChartField({
  type, displayName, path, sourceType, enumValues, value, description, isRequired, multiple,
  onChange
}) {
  function handleChange(val, index) {
    onChange({ path, multiple }, val, index);
  }

  function handleDeleteCsvColumn(index) {
    onChange({ path, multiple }, undefined, index);
  }

  function getFieldComponent() {
    switch (type) {
      case 'csvColumn':
        return (
          <DropCsvColumn
            value={value}
            multiple={multiple}
            onDrop={handleChange}
            onDelete={handleDeleteCsvColumn}
          />
        );
      case 'boolean':
        return (
          <Boolean
            value={value}
            onChange={handleChange}
          />
        );
      case 'enum':
        return (
          <Enum
            enumValues={enumValues}
            value={value}
            onChange={handleChange}
          />
        );
      case 'input':
        return (
          <Input
            type={sourceType}
            value={value}
            onChange={handleChange}
          />
        );
      case 'colorPicker':
        return (
          <Colors
            value={value}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div
      className={classnames('root')}
      style={{ backgroundColor: style.palette.primary.main }}
    >
      <Typography
        variant='h6'
        classes={{ root: classnames('name') }}
      >
        <span className={classnames('title')}>{displayName}</span>
        {isRequired && (
          <span className={classnames('isRequired')}>*</span>
        )}
      </Typography>
      <Typography
        variant='subtitle1'
        classes={{ root: classnames('description') }}
      >
        {description}
      </Typography>
      {getFieldComponent()}
    </div>
  );
}

ChartField.propTypes = {
  type       : PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  value      : PropTypes.any, // eslint-disable-line react/forbid-prop-types
  path       : PropTypes.string.isRequired,
  enumValues : PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string.isRequired,
  isRequired : PropTypes.bool,
  multiple   : PropTypes.bool,
  onChange   : PropTypes.func.isRequired
};

ChartField.defaultProps = {
  isRequired: false,
  multiple  : false,
  value     : undefined,
  enumValues: undefined
};
