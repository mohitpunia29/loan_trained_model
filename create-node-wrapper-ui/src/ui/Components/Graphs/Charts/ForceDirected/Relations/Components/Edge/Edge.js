import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import styles from './Edge.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Edge({ source, destination, active, activeStroke, stroke, strokeOpacity }) {
  const { x: sx, y: sy } = source.coordinates;
  const { x: dx, y: dy } = destination.coordinates;

  return (
    <line
      x1={sx}
      y1={sy}
      x2={dx}
      y2={dy}
      stroke={active ? activeStroke : stroke}
      strokeOpacity={active ? 1 : strokeOpacity}
    />
  )
}

Edge.propTypes = {
  source: PropTypes.shape({
    coordinates: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  }).isRequired,
  destination: PropTypes.shape({
    coordinates: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  }).isRequired,
  stroke       : PropTypes.string,
  strokeOpacity: PropTypes.number,
  active       : PropTypes.bool,
  activeStroke : PropTypes.string
};

Edge.defaultProps = {
  stroke       : '#000',
  strokeOpacity: .2,
  active       : false,
  activeStroke : '#F00'
};
