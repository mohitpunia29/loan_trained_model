/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { map as _map } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function Simple({
  chartData: { data, xAxis, yAxis, zAxis }, backgroundColor, colors, withLines, withTooltip, withLegend
}) {
  return (
    <ResponsiveContainer>
      <ScatterChart
        margin={{
          top   : 20,
          right : 20,
          bottom: 20,
          left  : 20
        }}
      >
        <CartesianGrid fill={backgroundColor} />
        <XAxis
          type={xAxis.type}
          dataKey={xAxis.dataKey}
          name={xAxis.name}
          unit={xAxis.unit}
        />
        <YAxis
          type={yAxis.type}
          dataKey={yAxis.dataKey}
          name={yAxis.name}
          unit={yAxis.unit}
        />
        {zAxis && (
          <ZAxis
            type={zAxis.type}
            dataKey={zAxis.dataKey}
            name={zAxis.name}
            unit={zAxis.unit}
            range={zAxis.range}
          />
        )}
        {withTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
        {withLegend && <Legend />}
        {_map(data, (dataSet, index) => (
          <Scatter
            key={dataSet.name}
            name={dataSet.name}
            data={dataSet.data}
            line={withLines}
            fill={colors[index]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

Simple.displayName = 'Scatter chart';

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
          type       : 'object',
          properties : {
            type: {
              description: 'The type of data',
              type       : 'string',
              source     : 'enum',
              enum       : ['number']
            },
            dataKey: {
              description: 'The column to use as the data source',
              type       : 'string',
              source     : 'column'
            },
            name: {
              description: 'The name of the data',
              type       : 'string',
              source     : 'input'
            },
            unit: {
              description: 'The unit of the data',
              type       : 'string',
              source     : 'input'
            }
          }
        },
        yAxis: {
          type      : 'object',
          properties: {
            type: {
              description: 'The type of data',
              type       : 'string',
              source     : 'enum',
              enum       : ['number']
            },
            dataKey: {
              description: 'The column to use as the data source',
              type       : 'string',
              source     : 'column'
            },
            name: {
              description: 'The name of the data',
              type       : 'string',
              source     : 'input'
            },
            unit: {
              description: 'The unit of the data',
              type       : 'string',
              source     : 'input'
            }
          }
        },
        zAxis: {
          type      : 'object',
          properties: {
            type: {
              description: 'The type of data',
              type       : 'string',
              source     : 'enum',
              enum       : ['number']
            },
            dataKey: {
              description: 'The column to use as the data source',
              type       : 'string',
              source     : 'column'
            },
            name: {
              description: 'The name of the data',
              type       : 'string',
              source     : 'input'
            },
            unit: {
              description: 'The unit of the data',
              type       : 'string',
              source     : 'input'
            }
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
      exactItemsRef: '#chartData.data.length',
      items        : {
        description: 'The color to use for the line',
        type       : 'string',
        source     : 'colorPicker'
      }
    },
    withLines: {
      displayName: 'join dots',
      description: 'Join the points with lines',
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

Simple.propTypes = propTypeSchema(Simple.propTypesSchema);

Simple.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLines      : false,
  withLegend     : true,
  withTooltip    : true
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;
