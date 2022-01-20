import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import {
  map as _map
} from 'lodash';
import bindClassnames from 'classnames/bind';

import ResponsiveWrapper from '../ResponsiveWrapper/ResponsiveWrapper';

import styles from './Grid.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function GraphsGrid({ lg, md, sm, xs, children, height }) {
  // eslint-disable-next-line no-param-reassign
  ({ lg, md, sm, xs } = calculateBreakpoints({ lg, md, sm, xs }));

  return (
    <Grid
      container
      classes={{ container: classnames('root') }}
    >
      {_map(children, (child, index) => (
        <Grid
          key={index}
          item
          classes={{ item: classnames('item') }}
          style={{ height }}
          lg={lg}
          md={md}
          sm={sm}
          xs={xs}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
}

GraphsGrid.propTypes = {
  lg      : PropTypes.number,
  md      : PropTypes.number,
  sm      : PropTypes.number,
  xs      : PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  height  : PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

GraphsGrid.defaultProps = {
  lg    : 3,
  md    : 2,
  sm    : 1,
  xs    : 1,
  height: 500
};

export function ResponsiveGrid({ children, ...props }) {
  // eslint-disable-next-line no-param-reassign
  children = _map(children, (child, index) => (
    <ResponsiveWrapper
      key={index}
      className={classnames('responsiveRoot')}
    >
      {child}
    </ResponsiveWrapper>
  ));

  return (
    <GraphsGrid
      {...props}
    >
      {children}
    </GraphsGrid>
  );
}

ResponsiveGrid.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired
};

const BREAKPOINTS_ORDER = ['xs', 'sm', 'md', 'lg'];

/**
 * Defaults the breakpoints starting from the smallest to biggest
 *
 * @param  {Object} breakpoints
 * @return {Object}
 */
function calculateBreakpoints(breakpoints) {
  if (!breakpoints[BREAKPOINTS_ORDER[0]]) {
    throw new Error(`${BREAKPOINTS_ORDER[0]} needs to be specified`);
  }

  for (const key in breakpoints) {
    const breakpoint = 12 / breakpoints[key];

    if (isFloat(breakpoint)) {
      throw new Error(`Invalid breakpoint after conversion: ${breakpoints[key]} -> ${breakpoint}`);
    }

    breakpoints[key] = breakpoint;
  }

  for (let i = 1; i < BREAKPOINTS_ORDER.length; i++) {
    if (!breakpoints[BREAKPOINTS_ORDER[i]]) {
      breakpoints[BREAKPOINTS_ORDER[i]] = breakpoints[BREAKPOINTS_ORDER[i - 1]];
    }
  }

  return breakpoints;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}
