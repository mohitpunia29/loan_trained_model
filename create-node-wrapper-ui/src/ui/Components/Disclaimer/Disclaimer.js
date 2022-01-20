import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { Typography } from '@material-ui/core';

import { get as getConfig } from '../../config/core';

import styles from './Disclaimer.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const { COMPANY_NAME, INFRASTRUCTURE_TEAM_EMAIL } = getConfig('modules.dashboards.variables', {});

export default function Disclaimer({ legend }) {
  return (
    <Typography
      variant='body1'
      component='p'
      classes={{
        body1: classnames('root')
      }}
    >
      {legend}
    </Typography>
  );
}

Disclaimer.propTypes = {
  legend: PropTypes.string
};

Disclaimer.defaultProps = {
  // eslint-disable-next-line prefer-template
  legend: 'This Entefy application is a prototype. ' +
      'By design, it is limited in scope and functionality. ' +
      'Therefore, it is not intended as a commercial, fully-functional downloadable software or SaaS service. ' +
      `This Entefy prototype application is provided exclusively to ${COMPANY_NAME} for evaluation purposes ` +
      `and only available to authorized ${COMPANY_NAME} staff ` +
      'who have been provided a named account with login credentials. ' +
      'If you are not the person named on this account, ' +
      `log out immediately and notify Entefy’s infrastructure team at ${INFRASTRUCTURE_TEAM_EMAIL}. ` +
      'Thank you from the Entefy Team.'
};
