import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Trash = ({ color, ...rest }) => (
  <SvgIcon {...rest}>
    <path fill={color} d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z' />
  </SvgIcon>
);

Trash.propTypes = {
  color  : PropTypes.string,
  viewBox: PropTypes.string
};

Trash.defaultProps = {
  color  : undefined,
  viewBox: '0 2 20 20'
};

export default Trash;
