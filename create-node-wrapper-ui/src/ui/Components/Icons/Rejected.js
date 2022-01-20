import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Rejected = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <g id='Rejected_X' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <circle id='Oval' fill='#909090' cx='18' cy='18' r='18' />
      <path d='M10,26 L26,10' id='Line' stroke='#FFFFFF' strokeWidth='3' fill='#FFFFFF' strokeLinecap='round' />
      <path d='M10,26 L26,10' id='Line' stroke='#FFFFFF' strokeWidth='3' fill='#FFFFFF' strokeLinecap='round' transform='translate(18.000000, 18.000000) rotate(90.000000) translate(-18.000000, -18.000000)' />
    </g>
  </SvgIcon>
);
Rejected.propTypes = {
  viewBox: PropTypes.string
};

Rejected.defaultProps = {
  viewBox: '0 0 40 40'
};

export default Rejected;
