import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import styles from './ResponsiveWrapper.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function ResponsiveWrapper({ children }) {
  return (
    <div className={classnames('root')}>
      {children}
    </div>
  );
}

ResponsiveWrapper.propTypes = {
  children: PropTypes.node.isRequired
};
