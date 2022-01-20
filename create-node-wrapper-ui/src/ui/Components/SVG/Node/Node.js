import React from 'react';
import PropTypes from 'prop-types';

import bindClassnames from 'classnames/bind';

import styles from './Node.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const PADDING = 10;

/**
 * Returns an SVG grouped object of our custom Entity Node
 * It consists of a circle and text
 *
 * @function  Node
 * @param     {Object}  content           holds all node's content info such as label, description,
 *                                        radius (distinguishing occurances usually)
 * @param     {Object}  transformations   position, rotation and orientation
 * @param     {Boolean} showLabels        shows or hides labels
 * @param     {Object}  actions           actions attached to the node (onClick, onHover, onLeave)
 * @return    {Object}
 */
export default function Node({ content, transformations, showLabels, actions }) {
  const { label, color, radius } = content;
  const { x, y, rotate = 0, orientation = 'right' } = transformations;
  const { onClick, onHover, onLeave } = actions;

  const padding = orientation === 'right' ? PADDING + radius : -(PADDING + radius);
  const textAnchor = orientation === 'right' ? 'start' : 'end';

  return (
    <g
      className={classnames('node_root')}
      transform={`translate(${x},${y}) rotate(${rotate})`}
      style={{ pointerEvents: 'bounding-box' }}
    >
      <circle
        cx='0'
        cy='0'
        r={radius}
        fill={color}
        onClick={onClick}
        onMouseOver={onHover}
        onFocus={onHover}
        onMouseLeave={onLeave}
      />
      { showLabels && (
        <text
          x={padding}
          y='0'
          dy='.35em'
          className={classnames('node_text')}
          fill={color > -1 ? color : '#000'}
          style={{ textAnchor }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

Node.propTypes = {
  content        : PropTypes.object,
  transformations: PropTypes.object,
  showLabels     : PropTypes.bool,
  actions        : PropTypes.object
};

Node.defaultProps = {
  actions: {
    onHover: () => {},
    onClick: () => {},
    onLeave: () => {}
  }
};
