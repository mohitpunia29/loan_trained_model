import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Approved = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <g id='Checkmark' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <circle id='Oval' fill='#6F9E4C' cx='18' cy='18' r='18' />
      <path d='M10,17.1861809 C20.6772909,31.1762164 14.685278,24.4795408 26,12' id='Path-2' stroke='#FFFFFF' strokeWidth='3' strokeLinecap='round' />
    </g>
  </SvgIcon>
);
Approved.propTypes = {
  viewBox: PropTypes.string
};

Approved.defaultProps = {
  viewBox: '0 0 40 40'
};

export default Approved;
