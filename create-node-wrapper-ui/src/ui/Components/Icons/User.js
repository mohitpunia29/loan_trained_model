import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const User = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <path d='M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z' />
  </SvgIcon>
);
User.propTypes = {
  viewBox: PropTypes.string
};

User.defaultProps = {
  viewBox: '0 0 24 24'
};

export default User;