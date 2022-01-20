/* eslint-disable prefer-destructuring */
import React from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';

import { Typography, Paper, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import styles from './Denied.module.css';

function Denied({ history, location }) {
  setTimeout(() => history.push('/'), 4000);

  return (
    <div className={styles.root}>
      <Paper className={styles.container}>
        <Typography variant='h5'>
          Access Denied
        </Typography>
        <Typography variant='body1'>
          It appears you are signing in from an unauthorized domain
          <br />
          You will be redirected shortly
        </Typography>
      </Paper>
    </div>
  );
}

Denied.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.object
    })
  }).isRequired
};

Denied.defaultProps = {
};

export default withRouter(Denied);
