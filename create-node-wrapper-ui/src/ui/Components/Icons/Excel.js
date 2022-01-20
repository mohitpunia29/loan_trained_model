/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

const Excel = ({ ...rest }) => (
  <SvgIcon {...rest}>
    <path fill='#207245' d='M32.64,0V5c6.29,0,2.48,0,8.76,0a5.78,5.78,0,0,1,3.15.6,5.76,5.76,0,0,1,.62,3.18q0,16.35,0,32.69a28.64,28.64,0,0,1-.21,5.5c-.25,1.31-1.82,1.34-2.87,1.38-6.51,0-2.92,0-9.44,0V54S9.58,50.65,0,49V5C9.64,3.35,32.64,0,32.64,0Z' />
    <path fill='#fff' d='M32.64,6.91H43.27V46.46H32.64V42.7h1V38.3h-1V35.79h1V31.4h-1V28.88h1v-4.4h-1V22h1V17.58h-1V15.07h1v-4.4h-1Z' />
    <path fill='#207245' d='M36.17,10.67h4.7v4.4h-4.7Z' />
    <path fill='#fff' d='M18.6,16.56q2.13-.15,4.27-.26-2.51,5.15-5.07,10.29c1.73,3.52,3.49,7,5.22,10.52-1.51-.09-3-.18-4.53-.29a74.16,74.16,0,0,1-3.13-7.89c-.85,2.55-2.07,5-3.05,7.45-1.37,0-2.75-.08-4.13-.13C9.8,33.1,11.35,29.92,13,26.78c-1.41-3.23-3-6.4-4.42-9.62l4.14-.24c.94,2.45,2,4.88,2.73,7.4C16.3,21.65,17.54,19.14,18.6,16.56Z' />
    <path fill='#207245' d='M36.17,17.58h4.7V22h-4.7Z' />
    <path fill='#207245' d='M36.17,24.49h4.7v4.4h-4.7Z' />
    <path fill='#207245' d='M36.17,31.4h4.7v4.4h-4.7Z' />
    <path fill='#207245' d='M36.17,38.3h4.7V42.7h-4.7Z' />
  </SvgIcon>
);

Excel.propTypes = {
  viewBox: PropTypes.string
};

Excel.defaultProps = {
  viewBox: '0 0 45.18 54'
};

export default Excel;
