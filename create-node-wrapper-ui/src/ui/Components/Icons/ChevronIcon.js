import PropTypes from 'prop-types';
import React from 'react';
import { SvgIcon } from '@material-ui/core';

/**
 * Render a chevron based on a given direction
 *
 * @method renderDirectionalChevron
 * @param  {string}                 direction The direction of the chevron
 * @return {JSX}
 */
const renderDirectionalChevron = direction => {
  switch (direction) {
    case 'up':
      // return <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />;
      return (
        <path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" />
      );
    case 'right':
      // return <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />;
      return (
        <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
      );
    case 'down':
      // return <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />;
      return (
        <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
      );
    case 'left':
      // return <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />;
      return (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      );
    default:
      return null;
  }
};

/**
 * Render a 'thin' chevron based on a given direction
 *
 * @method renderDirectionalChevronThin
 * @param  {string}                     direction The direction of the chevron
 * @return {JSX}
 */
const renderDirectionalChevronThin = direction => {
  switch (direction) {
    case 'up':
      return (
        <polygon
          points="96.536,490 403.019,244.996 96.536,0 86.981,11.962 378.496,244.996 86.981,478.038"
          transform="translate(0) rotate(-90 245 245)"
        />
      );
    case 'right':
      return (
        <polygon points="96.536,490 403.019,244.996 96.536,0 86.981,11.962 378.496,244.996 86.981,478.038" />
      );
    case 'down':
      return (
        <polygon
          points="96.536,490 403.019,244.996 96.536,0 86.981,11.962 378.496,244.996 86.981,478.038"
          transform="translate(0) rotate(90 245 245)"
        />
      );
    case 'left':
      return (
        <polygon points="401.166,478.097 113.178,245.004 401.166,11.903 391.536,0 88.834,245.004 391.536,490" />
      );
    default:
      return null;
  }
};

const ChevronIcon = ({ direction, type, ...rest }) =>
  type === 'thin' ? (
    <SvgIcon viewBox="0 0 490 490" {...rest}>
      {renderDirectionalChevronThin(direction)}
    </SvgIcon>
  ) : (
    <SvgIcon viewBox="0 0 24 24" {...rest}>
      {renderDirectionalChevron(direction)}
    </SvgIcon>
  );

ChevronIcon.propTypes = {
  direction: PropTypes.oneOf(['up', 'right', 'down', 'left']),
  type: PropTypes.oneOf(['thin', 'default'])
};

ChevronIcon.defaultProps = {
  direction: 'up',
  type: 'default'
};

export default ChevronIcon;
