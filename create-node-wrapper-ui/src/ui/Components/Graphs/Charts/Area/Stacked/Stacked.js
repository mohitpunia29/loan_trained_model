/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { map as _map, without as _without } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function Stacked({
  chartData: { data, xAxis, yAxis }, transparency, backgroundColor, colors, withTooltip, withLegend
}) {
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
        <defs>
          {_map(colors, (color, index) => (
            <linearGradient
              key={color}
              id={`color${index}`}
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop offset='55%' stopColor={color} stopOpacity={1}/>
              <stop offset='100%' stopColor={color} stopOpacity={transparency}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray='3 3' fill={backgroundColor} />
        <XAxis dataKey={xAxis} />
        <YAxis />
        {withTooltip && <Tooltip />}
        {withLegend && <Legend />}
        {_map(yAxis, (yAxisDataKey, index) => (
          <Area
            key={yAxisDataKey}
            type='monotone'
            stackId='1'
            dataKey={yAxisDataKey}
            stroke={colors[index]}
            fill={`url(#color${index})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

Stacked.displayName = 'Stacked area chart';

Stacked.propTypesSchema = {
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
          type : 'array',
          items: {
            description: 'A column to use to display in the yAxis',
            type       : 'string',
            source     : 'column'
          }
        }
      }
    },
    transparency: {
      displayName: 'color transparency',
      description: 'Apply transparency to area colors',
      type       : 'number',
      source     : 'input'
    },
    backgroundColor: {
      description: 'The color for the background',
      type       : 'string',
      source     : 'colorPicker'
    },
    colors: {
      type         : 'array',
      minItems     : 1,
      exactItemsRef: '#chartData.yAxis.length',
      items        : {
        description: 'The color to use for the area',
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

Stacked.propTypes = propTypeSchema(Stacked.propTypesSchema);

Stacked.defaultProps = {
  transparency   : 0.2,
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLegend     : true,
  withTooltip    : true
};

// export the default
Stacked.defaultData = defaultData;

Stacked.thumbnail = thumbnail;
