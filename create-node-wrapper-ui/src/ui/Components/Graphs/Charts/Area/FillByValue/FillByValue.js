/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { map as _map } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function FillByValue({
  chartData: { data, xAxis, yAxis }, backgroundColor, colors, withTooltip, withLegend
}) {
  function gradientOffset(key) {
    const dataMax = Math.max(...data.map(i => i[key]));
    const dataMin = Math.min(...data.map(i => i[key]));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  }

  const off = gradientOffset(yAxis);

  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top   : 10,
          right : 30,
          left  : 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray='3 3' fill={backgroundColor}/>
        <XAxis dataKey={xAxis} />
        <YAxis />
        {withTooltip && <Tooltip />}
        {withLegend && <Legend />}
        <defs>
          <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
            {_map(colors, color => (
              <stop
                key={color}
                offset={off}
                stopColor={color}
                stopOpacity={1}
              />
            ))}
          </linearGradient>
        </defs>
        <Area
          type='monotone'
          dataKey={yAxis}
          stroke='#000'
          fill='url(#splitColor)'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

FillByValue.displayName = 'FillByValue area chart';

FillByValue.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'xAxis', 'yAxis'],
      properties: {
        data: {
          type : 'array',
          items: {
            source: 'data',
            type  : 'object'
          }
        },
        xAxis: {
          description: 'The column to use to display the xAxis',
          type       : 'string',
          source     : 'column'
        },
        yAxis: {
          description: 'A column to use to display in the yAxis',
          type       : 'string',
          source     : 'column'
        }
      }
    },
    backgroundColor: {
      description: 'The color for the background',
      type       : 'string',
      source     : 'colorPicker'
    },
    colors: {
      type    : 'array',
      minItems: 2,
      maxItems: 2,
      items   : {
        description: 'The color to use for the line',
        type       : 'string',
        source     : 'colorPicker'
      }
    },
    withLegend: {
      displayName: 'legend',
      description: 'Display the legend',
      type       : 'boolean'
    },
    withTooltip: {
      displayName: 'tooltip',
      description: 'Show the tooltip on hover',
      type       : 'boolean'
    }
  }
};

FillByValue.propTypes = propTypeSchema(FillByValue.propTypesSchema);

FillByValue.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.getContrast(),
  withLegend     : true,
  withTooltip    : true
};

// export the default
FillByValue.defaultData = defaultData;

FillByValue.thumbnail = thumbnail;
