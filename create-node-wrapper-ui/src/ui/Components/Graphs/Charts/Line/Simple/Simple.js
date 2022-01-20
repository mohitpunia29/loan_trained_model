/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { map as _map } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function Simple({
  chartData: { data, xAxis, yAxis }, backgroundColor, colors, withDashes, withTooltip, toolTipContent, withLegend,
  children
}) {
  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top   : 5,
          right : 30,
          left  : 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='3 3' fill={backgroundColor} />
        <XAxis dataKey={xAxis} />
        <YAxis />
        {withTooltip && <Tooltip content={toolTipContent} />}
        {withLegend && <Legend />}
        {children && children({ data, xAxis, yAxis })}
        {_map(yAxis, (xAxisDataKey, index) => (
          <Line
            key={xAxisDataKey}
            type='monotone'
            dataKey={xAxisDataKey}
            stroke={colors[index]}
            {...{ strokeDasharray: withDashes ? '5 5' : undefined }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

Simple.displayName = 'Line chart';

Simple.propTypesSchema = {
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
        description: 'The color to use for the line',
        type       : 'string',
        source     : 'colorPicker'
      }
    },
    withDashes: {
      displayName: 'dashes',
      description: 'Display dashed lines',
      type       : 'boolean'
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

Simple.propTypes = {
  ...propTypeSchema(Simple.propTypesSchema),
  toolTipContent: PropTypes.func,
  children      : PropTypes.func
};

Simple.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withDashes     : false,
  withLegend     : true,
  withTooltip    : true,
  toolTipContent : null,
  children       : null
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;
