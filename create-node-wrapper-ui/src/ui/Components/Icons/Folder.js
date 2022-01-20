import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Folder = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <path d='M26.25,8.75 L1.75,8.75 L1.75,3.5 C1.75,2.534 2.534,1.75 3.5,1.75 L8.75,1.75 C9.716,1.75 10.5,2.534 10.5,3.5 L10.5,5.25 L24.5,5.25 C25.466,5.25 26.25,6.034 26.25,7 L26.25,8.75 L26.25,8.75 Z M26.25,24.5 C26.25,25.466 25.466,26.25 24.5,26.25 L3.5,26.25 C2.534,26.25 1.75,25.466 1.75,24.5 L1.75,10.5 L26.25,10.5 L26.25,24.5 L26.25,24.5 Z M24.5,3.5 L12.25,3.5 C12.25,1.567125 10.682875,0 8.75,0 L3.5,0 C1.567125,0 0,1.567125 0,3.5 L0,24.5 C0,26.432875 1.567125,28 3.5,28 L24.5,28 C26.432875,28 28,26.432875 28,24.5 L28,7 C28,5.067125 26.432875,3.5 24.5,3.5 L24.5,3.5 Z' />
  </SvgIcon>
);
Folder.propTypes = {
  viewBox: PropTypes.string
};

Folder.defaultProps = {
  viewBox: '0 0 28 28'
};

export default Folder;
