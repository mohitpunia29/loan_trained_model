import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Download = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

Download.propTypes = {
  viewBox: PropTypes.string
};

Download.defaultProps = {
  viewBox: '0 0 24 24'
};

export default Download;
