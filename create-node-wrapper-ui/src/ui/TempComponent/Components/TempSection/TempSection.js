import React, { useState, useEffect, useContext } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
// This useSnackbar component is coming from Materials UI and allows for a message when something is added to the temp section. Currently it is not being utilized but in the future it will be.
import { useSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {
  isArray as _isArray,
  isEmpty as _isEmpty
} from 'lodash';

// Both the useConfigContext and the useSocket are not being used??? 

import { useConfigContext } from '../../../Providers/ConfigProvider/ConfigProvider';

import useSocket from '../../../Hooks/useSocket';

import styles from './TempSection.module.css';

export default function TempSection() {
  const saveSettings = () => {};

  return (
    <div className={styles.root}>
      <div className={styles.invitationsHeader}>
        <Typography
          // variant='h1'
          classes={{ root: styles.title }}
        >
          Testing Dashboard
        </Typography>
        <Button
          variant='contained'
          color='primary'
          classes={{ root: styles.submitDisabled }}
          onClick={saveSettings}
        >

          {/* Apply more functionality once design on Sketch is finalized */}
          Update
        </Button>
      </div>
      <div className={styles.mainContainer}>
      </div>
    </div>
  );
}
