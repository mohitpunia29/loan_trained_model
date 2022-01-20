import React from 'react';

import bindClassnames from 'classnames/bind';
import Graph from '../../../../../static/graphs/CircularDendrogram/CircularDendrogram.png';

import styles from './CircularDendrogram.module.css';

const classnames = bindClassnames.bind(styles);

export default function CircularDendrogram() {
  return (
    <div className={classnames('root')}>
      <img src={Graph} style={{ width: '100%' }} alt={Graph} />
    </div>
  );
}
