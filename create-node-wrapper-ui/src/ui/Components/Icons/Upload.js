import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Upload = ({ viewBox, color }) => (
  <SvgIcon viewBox={viewBox}>
    <g id='Upload_Icon_File_Grey' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' strokeLinecap='round' strokeLinejoin='round'>
      <polyline id='Path' stroke={color} strokeWidth='2' points='1 20 1 27 27 27 27 20' />
      <path d='M14,2 L20,8' id='Path' stroke={color} strokeWidth='2' />
      <path d='M8,8 L14,2' id='Path' stroke={color} strokeWidth='2' />
      <path d='M14,2 L14,15' id='Path' stroke={color} strokeWidth='2' />
    </g>
  </SvgIcon>
);
Upload.propTypes = {
  viewBox: PropTypes.string,
  color  : PropTypes.string
};

Upload.defaultProps = {
  viewBox: '0 0 28 28',
  color  : '#000'
};

export default Upload;
