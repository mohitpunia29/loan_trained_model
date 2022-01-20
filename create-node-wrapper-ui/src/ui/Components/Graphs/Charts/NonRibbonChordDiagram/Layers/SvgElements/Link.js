import React from 'react';
import PropTypes from 'prop-types';

import {
  isEqual as _isEqual
} from 'lodash';

import bindClassnames from 'classnames/bind';
import styles from './Link.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

/**
 * Returns an SVG Line entity
 * It consists of a Quadratic Bezier Curve
 *
 * @function Line
 * @param    {Object} start   the starting node
 * @param    {Object} finish  the ending node
 * @param    {Object} center  the control point
 * @param    {Object} actions actions attached
 * @return   {Object}
 */
export default function Link({ start, finish, activeNode, actions }) {
  const { x: sx, y: sy } = start.transformations;
  const { x: fx, y: fy } = finish.transformations;
  const active = _isEqual(start, activeNode) || _isEqual(finish, activeNode);
  const cx = start.transformations.center.x;
  const cy = (start.transformations.center.y + finish.transformations.center.y) / 2;
  const { onHover, onClick } = actions;

  return (
    <path
      d={`M${sx},${sy} Q${cx},${cy} ${fx},${fy}`}
      className={classnames('link', { active })}
      onClick={onClick}
      onMouseOver={onHover}
      onFocus={onHover}
    />
  );
}

Link.propTypes = {
  start     : PropTypes.object,
  finish    : PropTypes.object,
  activeNode: PropTypes.object,
  actions   : PropTypes.object
};

Link.defaultProps = {
  actions: {
    onHover: () => {},
    onClick: () => {}
  }
};
