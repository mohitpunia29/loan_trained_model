/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';

import { useSpring, animated } from 'react-spring';

import bindClassnames from 'classnames/bind';
import styles from './Tooltip.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

/**
 * Returns an SVG grouped object of our custom Entity Node
 * It consists of a circle and text
 *
 * @function  Tooltip
 * @param     {Object}  content           holds all node's content info such as text
 * @param     {Object}  transformations   position, rotation and center of container
 * @param     {Boolean} showLabels        shows or hides labels
 * @param     {Object}  actions           actions attached to the node (onClick, onHover, onLeave)
 * @return    {Object}
 */
export default function Tooltip({ children, transformations, container, actions }) {
  const { x, y, rotate = 0 } = transformations;
  const { width, height } = container;
  const { onClick, onHover, onLeave } = actions;

  const isUp = y > height / 3;

  const animate = useSpring({
    top       : `${y}px`,
    marginLeft: `${x}px`,
    opacity   : 1,
    from      : { top: `${isUp ? y - 30 : y + 30}px`, opacity: 0 }
  });

  return (
    <animated.div
      className={classnames(isUp ? 'arrow_box_up' : 'arrow_box_bottom')}
      style={animate}
      onClick={onClick}
      onMouseOver={onHover}
      onFocus={onHover}
      onMouseLeave={onLeave}
    >
      {children}
    </animated.div>
  );
}

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  transformations: PropTypes.object,
  container      : PropTypes.object,
  actions        : PropTypes.object
};

Tooltip.defaultProps = {
  children: <div />,
  actions : {
    onHover: () => {},
    onClick: () => {},
    onLeave: () => {}
  }
};
