import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Close = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
  </SvgIcon>
);

Close.propTypes = {
  viewBox: PropTypes.string
};

Close.defaultProps = {
  viewBox: '0 0 24 24'
};

export default Close;
