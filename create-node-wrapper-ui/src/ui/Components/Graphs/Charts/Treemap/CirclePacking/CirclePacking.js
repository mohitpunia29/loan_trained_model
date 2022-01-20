import React from 'react';

import bindClassnames from 'classnames/bind';
import Graph from '../../../../../static/graphs/CirclePacking/NNDSS_-Invasive_pneumococcal_disease__all_ages.png';

import styles from './CirclePacking.module.css';

const classnames = bindClassnames.bind(styles);

export default function CirclePacking() {
  return (
    <div className={classnames('root')}>
      <img src={Graph} style={{ width: '100%' }} alt={Graph} />
    </div>
  );
}
