import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Run = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
  </SvgIcon>
);

Run.propTypes = {
  viewBox: PropTypes.string
};

Run.defaultProps = {
  viewBox: '0 0 24 24'
};

export default Run;
