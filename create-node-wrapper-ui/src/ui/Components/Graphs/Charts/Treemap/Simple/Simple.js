import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  Treemap
} from 'recharts';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function Simple({ data, dataKey, color, ratio, stokeColor, ...props }) {
  return (
    <ResponsiveContainer>
      <Treemap
        {...props}
        data={data}
        dataKey={dataKey}
        ratio={ratio}
        stroke={stokeColor}
        fill={color}
      />
    </ResponsiveContainer>
  );
}

Simple.displayName = 'Simple treemap chart';

Simple.propTypes = {
  data       : PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey    : PropTypes.string.isRequired,
  ratio      : PropTypes.number.isRequired,
  color      : PropTypes.string,
  stokeColor : PropTypes.string,
  withLegend : PropTypes.bool,
  withTooltip: PropTypes.bool
};

Simple.defaultProps = {
  color      : colorPalette.get()[0],
  stokeColor : '#fff',
  withLegend : true,
  withTooltip: true
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;
