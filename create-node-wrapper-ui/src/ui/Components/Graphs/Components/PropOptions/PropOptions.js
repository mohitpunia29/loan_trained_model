import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  filter as _filter,
  get as _get,
  map as _map,
  set as _set
} from 'lodash';
import bindClassnames from 'classnames/bind';

import OptionWrapper from './Components/OptionWrapper/OptionWrapper';
import Boolean from './Components/Boolean/Boolean';
import Enum from './Components/Enum/Enum';

import styles from './PropOptions.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function PropOptions({ config, props, setProps }) {
  const [{ fields, required }] = useState(getConfig(config));

  function handleChange(value, path) {
    setProps(prevState => {
      _set(prevState, path, value);

      return { ...prevState };
    });
  }

  return (
    <div
      className={classnames('root')}
    >
      {_map(fields, ({ displayName, isRequired, type, path, enumValues }) => (
        <OptionWrapper
          key={displayName}
          name={displayName}
          isRequired={isRequired}
        >
          {type === 'boolean' && (
            <Boolean
              value={_get(props, path)}
              onChange={value => handleChange(value, path)}
            />
          )}
          {type === 'enum' && (
            <Enum
              enumValues={enumValues}
              value={_get(props, path)}
              onChange={value => handleChange(value, path)}
            />
          )}
        </OptionWrapper>
      ))}
    </div>
  );
}

PropOptions.propTypes = {
  config: PropTypes.shape({
    fields  : PropTypes.arrayOf(PropTypes.object),
    required: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  props   : PropTypes.object.isRequired,
  setProps: PropTypes.func.isRequired
};

function getConfig({ fields, required }) {
  const supportedFields = _filter(fields, ({ type }) => {
    return ['boolean', 'enum'].indexOf(type) !== -1;
  });
  const fieldNames = _map(supportedFields, 'name');

  return {
    fields  : supportedFields,
    required: required.filter(field => fieldNames.indexOf(field) !== -1)
  };
}
