import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import styles from './Container.module.css';

export default function Container({ title, chart, padding }) {
  return (
    <div
      className={styles.root}
      style={{ padding }}
    >
      {title && (
        <Typography
          classes={{ root: styles.title }}
          variant='h6'
        >
          {title}
        </Typography>
      )}
      <div className={styles.chart}>
        {chart}
      </div>
    </div>
  );
}

Container.propTypes = {
  title  : PropTypes.string,
  chart  : PropTypes.node.isRequired,
  padding: PropTypes.number
};

Container.defaultProps = {
  title  : undefined,
  padding: 16
};
