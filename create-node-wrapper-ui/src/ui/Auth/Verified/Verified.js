import React from 'react';

import { NavLink } from 'react-router-dom';
import { Typography, Paper, Button } from '@material-ui/core';

import serviceRoutes from '../../constants/serviceRoutes';

import styles from './Verified.module.css';

const { LOGIN_ROUTE } = serviceRoutes;

export default function Verified() {
  return (
    <div className={styles.root}>
      <Paper className={styles.container}>
        <div className={styles.message}>
          <Typography variant='h5'>
            Verification Successful!
          </Typography>
          <Typography variant='body1'>
            We just sent you a temporary password
            <br />
            for your first login by email.
          </Typography>
        </div>
        <Button
          color='primary'
          variant='contained'
          component={NavLink}
          to={LOGIN_ROUTE}
          classes={{ root: styles.button }}
        >
          Go to Login
        </Button>
      </Paper>
    </div>
  );
}
