/* eslint-disable no-multi-spaces */
import React from 'react';
import PropTypes from 'prop-types';

import bindClassnames from 'classnames/bind';

import { NODE, PALETTE } from './constants';
import styles from './Node.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

/**
 * Returns an SVG grouped object of our custom Entity Node
 * It consists of a circle and text
 *
 * @function  Node
 * @param     {Object}  content           holds all node's content info such as label, description,
 *                                        radius (distinguishind occurances usually)
 * @param     {Object}  transformations   position, rotation and orientation
 * @param     {Object}  actions           actions attached to the node (onClick, onHover, onLeave)
 * @return    {Object}
 */
export default function Node({ content, transformations, actions }) {
  const { label, color = 0, radius = 5 }        = content;
  const { x, y, rotate, orientation = 'right' } = transformations;
  const { onClick, onHover, onLeave }           = actions;

  const padding = orientation === 'right' ? NODE.padding + radius : -(NODE.padding + radius);
  const textAnchor = orientation === 'right' ? 'start' : 'end';

  const palette = 'BBD';

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <g
      className={classnames('node_root')}
      transform={`translate(${x},${y}) rotate(${rotate})`}
      onClick={onClick}
      onMouseOver={onHover}
      onMouseLeave={onLeave}
      style={{ pointerEvents: 'bounding-box' }}
    >
      <circle cx='0' cy='0' r={radius} fill={PALETTE[palette][color]} />
      <text
        x={padding} y='0' dy='.35em'
        className={classnames('node_text')}
        fill={PALETTE[palette][color]}
        style={{ textAnchor }}
      >
        {label}
      </text>
    </g>
  );
}

Node.propTypes = {
  content        : PropTypes.object,
  transformations: PropTypes.object,
  actions        : PropTypes.object
};

Node.defaultProps = {
  actions: {
    onHover: () => {},
    onClick: () => {},
    onLeave: () => {}
  }
};
