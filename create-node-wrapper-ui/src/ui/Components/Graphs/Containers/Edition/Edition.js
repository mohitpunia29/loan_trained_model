import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Jsonlint from '../../../Jsonlint/Jsonlint';

import styles from './Edition.module.css';

export default function Edition({ component: Component, size }) {
  const [data, setData] = useState(Component.defaultData);

  return (
    <div className={styles.root} style={{ width: getWidth(size) }}>
      <div className={styles.container}>
        <div className={styles.chartContainer}>
          <Component
            {...data}
          />
        </div>
        <div className={styles.jsonlintContainer}>
          <Jsonlint
            defaultData={data}
            onDataChange={setData}
          />
        </div>
      </div>
    </div>
  );
}

Edition.propTypes = {
  component: PropTypes.func.isRequired,
  size     : PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

Edition.defaultProps = {
  size: 'lg'
};

function getWidth(size) {
  return {
    xs  : 360,
    sm  : 600,
    md  : 960,
    lg  : 1280,
    xl  : 1580,
    none: undefined
  }[size];
}
