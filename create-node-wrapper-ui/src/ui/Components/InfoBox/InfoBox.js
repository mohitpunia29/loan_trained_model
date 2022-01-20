import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useCountUp } from 'react-countup';

import { isString as _isString } from 'lodash';

import styles from './InfoBox.module.css';

export default function InfoBox({ counter, info, topLegend, bottomLegend, options }) {
  const { countUp, update } = useCountUp({
    end         : counter,
    formattingFn: (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  });

  return (
    <div className={styles.root}>
      <Typography>
        {topLegend && (
          <div className={styles.topLegend} style={{ color: options.topLegendColor }}>{topLegend}</div>
        )}
        {(counter || counter === 0) && (
          <div className={styles.counter} style={{ color: options.counterColor }}>{countUp}</div>
        )}
        {info && (
          <div className={styles.info} style={{ color: options.infoColor }}>{info}</div>
        )}
        {bottomLegend && (
          <div className={styles.bottomLegend} style={{ color: options.bottomLegendColor }}>{bottomLegend}</div>
        )}
      </Typography>
    </div>
  );
}

InfoBox.propTypes = {
  topLegend   : PropTypes.string,
  bottomLegend: PropTypes.string,
  counter     : PropTypes.number,
  info        : PropTypes.string,
  options     : PropTypes.objectOf({
    topLegendColor   : PropTypes.string,
    bottomLegendColor: PropTypes.string,
    counterColor     : PropTypes.string,
    infoColor        : PropTypes.string
  })
};

InfoBox.defaultProps = {
  counter     : null,
  info        : null,
  topLegend   : '',
  bottomLegend: '',
  options     : {
    topLegendColor   : 'gray',
    bottomLegendColor: 'gray',
    counterColor     : '#5a5a5a',
    infoColor        : '#5a5a5a'
  }
};
