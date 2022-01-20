import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { basic as colorPalette } from '../../../../../../../constants/colorPalettes';

import styles from './Node.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Node({ x, y, r, id, title, stroke, fill, onMouseDown, onMouseEnter, onMouseLeave }) {
  return (
    <g
      className={classnames('root')}
      onMouseDown={(event) => onMouseDown(event, id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <circle
        className={classnames('node')}
        cx={x}
        cy={y}
        r={r}
        stroke={stroke}
        fill={fill}
      />
      {title && (
        <text
          x={x + r + 5}
          y={y + r / 2 + 1}
        >
          {title}
        </text>
      )}
    </g>
  );
}

Node.propTypes = {
  x           : PropTypes.number.isRequired,
  y           : PropTypes.number.isRequired,
  r           : PropTypes.number.isRequired,
  id          : PropTypes.string,
  title       : PropTypes.string,
  stroke      : PropTypes.string,
  fill        : PropTypes.string,
  onMouseDown : PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

Node.defaultProps = {
  stroke      : colorPalette.getColor('black'),
  fill        : colorPalette.getColor('indigo'),
  id          : undefined,
  title       : undefined,
  onMouseDown : () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {}
};
