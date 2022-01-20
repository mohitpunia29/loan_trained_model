import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Download2 = ({ color, ...rest }) => (
  <SvgIcon {...rest}>
    <g id='Download_Icon_File_Grey' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' strokeLinecap='round' strokeLinejoin='round'>
      <polyline id='Path' stroke={color} strokeWidth='4' points='1 20 1 27 27 27 27 20' />
      <path d='M14,9 L20,15' id='Path' stroke={color} strokeWidth='3' transform='translate(17.000000, 12.000000) scale(1, -1) translate(-17.000000, -12.000000) ' />
      <path d='M8,15 L14,9' id='Path' stroke={color} strokeWidth='3' transform='translate(11.000000, 12.000000) scale(1, -1) translate(-11.000000, -12.000000) ' />
      <path d='M14,2 L14,15' id='Path' stroke={color} strokeWidth='3' />
    </g>
  </SvgIcon>
);

Download2.propTypes = {
  viewBox: PropTypes.string,
  color  : PropTypes.string
};

Download2.defaultProps = {
  viewBox: '0 0 34 34',
  color  : '#909090'
};

export default Download2;
