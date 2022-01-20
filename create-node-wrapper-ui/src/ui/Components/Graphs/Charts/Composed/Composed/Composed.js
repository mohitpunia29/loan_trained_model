/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, ComposedChart, Brush,
  Line, Area, Bar, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';
import {
  map as _map
} from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

// const tickFormatter = (d) => {
//   const date = d.split('-');
//   return `${date[1]}/${date[0].slice(-2)}`;
// };

export default function Composed({
  chartData: { data, xAxis, yAxis }, backgroundColor, colors, withTooltip, withBrush, withLegend, tick, customToolTip, xLabelAngle }) {

  return (
    <ResponsiveContainer>
      <ComposedChart
        data={data}
        margin={{
          top   : 20,
          right : 70,
          bottom: 20,
          left  : 20
        }}
      >
        <CartesianGrid stroke='#f5f5f5' fill={backgroundColor} />
        <XAxis dataKey={xAxis} tick={tick} angle={xLabelAngle} textAnchor='end' height={xLabelAngle ? 60 : 30} />
        <YAxis />
        {withTooltip && <Tooltip content={customToolTip} />}
        {withLegend && <Legend />}
        {withBrush && <Brush dataKey={xAxis} height={30} stroke={colors[2]} />}
        {_map(yAxis.area, ({ dataKey: areaDataKey }) => (
          <Area
            key={areaDataKey}
            stackId='1'
            type='monotone'
            dataKey={areaDataKey}
            stroke={colors[0]}
            fill={colors[0]}
          />
        ))}
        {_map(yAxis.bar, (bar) => (
          <Bar
            key={bar.dataKey}
            stackId='2'
            dataKey={bar.dataKey}
            fill={colors[1]}
            maxBarSize={8}
          />
        ))}
        {_map(yAxis.line, ({ dataKey: lineDataKey }) => (
          <Line
            key={lineDataKey}
            stackId='3'
            type='monotone'
            dataKey={lineDataKey}
            stroke={colors[2]}
          />
        ))}
        {_map(yAxis.scatter, ({ dataKey: scatterDataKey }) => (
          <Scatter
            key={scatterDataKey}
            stackId='4'
            dataKey={scatterDataKey}
            fill={colors[3]}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

Composed.displayName = 'Composed chart';

Composed.propTypesSchema = {
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
          type      : 'object',
          properties: {
            line: {
              type : 'array',
              items: {
                type      : 'object',
                properties: {
                  dataKey: {
                    description: 'The column to use as the data source',
                    type       : 'string',
                    source     : 'column'
                  }
                }
              }
            },
            bar: {
              type : 'array',
              items: {
                type      : 'object',
                properties: {
                  dataKey: {
                    description: 'The column to use as the data source',
                    type       : 'string',
                    source     : 'column'
                  }
                }
              }
            },
            area: {
              type : 'array',
              items: {
                type      : 'object',
                properties: {
                  dataKey: {
                    description: 'The column to use as the data source',
                    type       : 'string',
                    source     : 'column'
                  }
                }
              }
            },
            scatter: {
              type : 'array',
              items: {
                type      : 'object',
                properties: {
                  dataKey: {
                    description: 'The column to use as the data source',
                    type       : 'string',
                    source     : 'column'
                  }
                }
              }
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
      minItems     : 1,
      exactItemsRef: '#chartData.yAxis.length',
      items        : {
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
    },
    tick: {
      displayName: 'label',
      description: 'Show the label on axis',
      type       : 'boolean'
    }
  }
};

Composed.propTypes = {
  ...propTypeSchema(Composed.propTypesSchema),
  customToolTip: PropTypes.func,
  xLabelAngle  : PropTypes.number
};

Composed.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLegend     : true,
  withTooltip    : true,
  tick           : true,
  customToolTip  : null,
  xLabelAngle    : 360
};

// export the default
Composed.defaultData = defaultData;

Composed.thumbnail = thumbnail;
