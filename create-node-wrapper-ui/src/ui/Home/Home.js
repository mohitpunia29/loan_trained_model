import React from 'react';
import bindClassnames from 'classnames/bind';

import { Grid } from '@material-ui/core';

import Products from './components/Products';
import MimiAiPlatform from './components/MimiAiPlatform';

import styles from './Home.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Home() {
  return (
    <Grid container className={classnames('Home__root')}>
      <Grid container className={classnames('Home__topContainer')}>
        <Products />
        <MimiAiPlatform />
      </Grid>
      {/* <Grid container className={classnames('Home__secondblock')}>
        <Grid item xs={12}>
          <Typography variant="headline">
            WELCOME TO NEXT-GEN INTELLIGENCE FOR EVERY CORNER OF YOUR
            ORGANIZATION
          </Typography>
        </Grid>
      </Grid> */}
    </Grid>
  );
}
