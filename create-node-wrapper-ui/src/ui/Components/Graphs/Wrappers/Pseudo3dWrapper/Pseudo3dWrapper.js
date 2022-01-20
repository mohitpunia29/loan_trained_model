import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import styles from './Pseudo3dWrapper.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Pseudo3dWrapper({ active, children }) {
  if (!active) return children;
  
  return (
    <div className={classnames('pseudo3dWrapper rotated')}>
      {children}
    </div>
  );
}

Pseudo3dWrapper.propTypes = {
  active  : PropTypes.bool,
  children: PropTypes.node.isRequired
};

Pseudo3dWrapper.defaultProps = {
  active: false
};
