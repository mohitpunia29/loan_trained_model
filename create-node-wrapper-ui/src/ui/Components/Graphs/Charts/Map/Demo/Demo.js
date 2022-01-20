/* eslint-disable no-multi-spaces */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import parsePropTypesSchema from '../../../utils/parsePropTypesSchema';

import GeoMap from '../Geo/Geo';
import PropOptions from '../../../Components/PropOptions/PropOptions';

import styles from './Demo.module.css';

// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Demo({ markers, connections }) {
  const [config] = useState(parsePropTypesSchema(GeoMap.propTypesSchema));
  const [props, setProps] = useState({ ...GeoMap.defaultProps });

  return (
    <div className={classnames('root')}>
      <div className={classnames('mapContainer')}>
        <GeoMap
          {...props}
          markers={markers}
          connections={connections}
        />
      </div>
      <nav className={classnames('options')}>
        <PropOptions
          config={config}
          props={props}
          setProps={setProps}
        />
      </nav>
    </div>
  );
}

Demo.propTypes = {
  markers    : PropTypes.arrayOf(PropTypes.object),
  connections: PropTypes.arrayOf(PropTypes.object)
};

Demo.defaultProps = {
  ...GeoMap.defaultData
};
