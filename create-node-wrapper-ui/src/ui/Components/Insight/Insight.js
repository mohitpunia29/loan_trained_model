import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { withTheme } from '@material-ui/core/styles';

import CountUp from './Components/CountUp/CountUp';

import styles from './Insight.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

function Insight({ info, lexical, theme, borderColor, size }) {
  return (
    <div
      className={classnames('container')}
      style={{
        borderColor: borderColor || theme.palette.secondary.main,
        height     : size,
        width      : size
      }}
    >
      <div className={classnames('wording')}>
        <div className={classnames('info')}>
          <CountUp
            {...info}
            duration={1.5}
          />
        </div>
        <div className={classnames('lexical')}>
          {lexical}
        </div>
      </div>

    </div>
  );
}

Insight.propTypes = {
  info: PropTypes.shape({
    end         : PropTypes.number.isRequired,
    suffix      : PropTypes.string,
    decimals    : PropTypes.number,
    formattingFn: PropTypes.func
  }).isRequired,
  lexical    : PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  size       : PropTypes.number
};

Insight.defaultProps = {
  borderColor: undefined,
  size       : 180
};

export default withTheme()(Insight);
