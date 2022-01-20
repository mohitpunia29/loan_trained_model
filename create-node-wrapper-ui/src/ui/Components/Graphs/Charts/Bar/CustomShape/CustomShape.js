/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { map as _map } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import TriangleBar from './Shapes/Triangle/Triangle';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

const SHAPES = {
  triangle: <TriangleBar />
};

export default function CustomShape({
  chartData: { data, xAxis, yAxis }, shape, backgroundColor, colors, withTooltip, withLegend
}) {
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{
          top   : 20,
          right : 30,
          left  : 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='3 3' fill={backgroundColor} />
        <XAxis dataKey={xAxis} />
        <YAxis />
        {withTooltip && <Tooltip />}
        {withLegend && <Legend />}
        <Bar
          dataKey={yAxis}
          // fill={color}
          shape={SHAPES[shape]}
          label={{ position: 'top' }}
        >
          {_map(data, (d, index) => (
            <Cell
              key={data[index][yAxis]}
              fill={colors[index]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

CustomShape.displayName = 'Custom shape bar chart';

CustomShape.propTypesSchema = {
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
      type         : 'array',
      minItems     : 1,
      exactItemsRef: '#chartData.data.length',
      items        : {
        description: 'The colors to use for the lines',
        type       : 'string',
        source     : 'colorPicker'
      }
    },
    shape: {
      description: 'The shape of the bars',
      type       : 'string',
      source     : 'enum',
      enum       : ['triangle']
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

CustomShape.propTypes = propTypeSchema(CustomShape.propTypesSchema);

CustomShape.defaultProps = {
  shape          : 'triangle',
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLegend     : true,
  withTooltip    : true
};

// export the default
CustomShape.defaultData = defaultData;

CustomShape.thumbnail = thumbnail;
