import React from 'react';

import bindClassnames from 'classnames/bind';
import Graph from '../../../../../static/graphs/Sunburst/Sunburst.png';

import styles from './Sunburst.module.css';

const classnames = bindClassnames.bind(styles);

export default function Sunburst() {
  return (
    <div className={classnames('root')}>
      <img src={Graph} style={{ width: '100%' }} alt={Graph} />
    </div>
  );
}
