import React from 'react';

import bindClassnames from 'classnames/bind';

import ApprovedIcon from '../Components/Icons/Approved';
import RejectedIcon from '../Components/Icons/Rejected';
import styles from './rowTranslations.module.css';

// Bind to classnames
const classnames = bindClassnames.bind(styles);

// row transformations
const same = v => v;
const currency = m => `$${Number(m).toLocaleString()}`;
/* eslint-disable react/jsx-indent */
// const prediction = p => (p === 'approved' ? <span className={classnames('decision', 'approved')}>Approve</span> :
//                              <span className={classnames('decision', 'declined')}>Reject</span>);
const prediction = p => (p === 'approved' ? <ApprovedIcon /> : <RejectedIcon />);

const percent = point => p => (p ? `${parseFloat(p).toFixed(point)}%` : '');
const confidence = point => c => (c ? `${(parseFloat(c) * 100).toFixed(point)}%` : '');

const decision = d => (/[Aa]pproved/.test(d) ? <span className={classnames('decision', 'approved')}>{d}</span> :
                                               <span className={classnames('decision', 'declined')}>{d}</span>);
const proposal = p => (p ? 'Approve' : 'Decline');

// property transformations
const camelCase = (w) => {
  const words = w.split('.');
  return words[0] + words[1].charAt(0).toUpperCase() + words[1].slice(1);
};

const transform = {
  same,
  currency,
  prediction,
  percent,
  confidence,
  decision,
  proposal,
  camelCase
};

export default transform;
