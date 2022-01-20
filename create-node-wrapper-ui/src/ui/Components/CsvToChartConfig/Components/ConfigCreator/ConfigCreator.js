import React from 'react';
import PropTypes from 'prop-types';
import {
  get as _get,
  isNil as _isNil,
  isUndefined as _isUndefined,
  map as _map,
  set as _set
} from 'lodash';
import bindClassnames from 'classnames/bind';

import { Grid } from '@material-ui/core';

import CsvColumn from './Components/CsvColumn/CsvColumn';
import ChartField from './Components/ChartField/ChartField';

import styles from './ConfigCreator.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ConfigCreator({ csvColumns, config, data, setData }) {
  function handleFieldChange(path, value) {
    setData((prevState) => {
      _set(prevState, path, value);

      return { ...prevState };
    });
  }

  function handleArrayFieldChange(path, value, index) {
    setData((prevState) => {
      const val = _get(prevState, path) || [];
      // special case when removing from an array
      if (!_isNil(index) && _isUndefined(value)) {
        val.splice(index, 1);
      } else if (!_isNil(index)) {
        val[index] = value;
      } else {
        val.push(value);
      }

      _set(prevState, path, val);

      return { ...prevState };
    });
  }

  function handleChange({ path, multiple }, value, index) {
    console.log('handleChange', { path, multiple, value, index });
    if (multiple) {
      return handleArrayFieldChange(path, value, index);
    }

    return handleFieldChange(path, value);
  }

  console.log('____', { csvColumns, config, data });

  return (
    <Grid
      container
      spacing={8}
      classes={{ container: classnames('root') }}
    >
      {/* Should always be visible on the left side */}
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        classes={{ item: classnames('csvColumnsContainer') }}
      >
        {_map(csvColumns, name => (
          <CsvColumn
            key={name}
            name={name}
          />
        ))}
      </Grid>
      {/* Should be scrollable, to ensure we can always drag and drop csv columns */}
      <Grid
        item
        xs={12}
        sm={6}
        md={8}
        lg={9}
        classes={{ item: classnames('chartFieldsContainer') }}
      >
        <Grid
          container
          spacing={8}
        >
          {_map(config.fields, ({ displayName, path, multiple, ...otherFieldProps }) => (
            <Grid
              key={displayName}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
            >
              <ChartField
                displayName={displayName}
                path={path}
                multiple={multiple}
                {...otherFieldProps}
                value={_get(data, path)}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

ConfigCreator.propTypes = {
  csvColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  config    : PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.shape({
      name       : PropTypes.string,
      path       : PropTypes.string,
      type       : PropTypes.string,
      description: PropTypes.string,
      multiple   : PropTypes.bool,
      isRequired : PropTypes.bool
    }))
  }).isRequired,
  data   : PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setData: PropTypes.func.isRequired
};
