/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  PieChart, Pie, Tooltip, Legend
} from 'recharts';
import { map as _map } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function TwoLevel({ chartData, backgroundColor, colors, withTooltip, withLegend }) {
  return (
    <ResponsiveContainer>
      <PieChart style={{ backgroundColor }}>
        {withTooltip && <Tooltip />}
        {withLegend && <Legend formatter={renderColorfulLegend} />}
        {_map(chartData, ({ data: dataPoints, nameKey, dataKey, ...otherProps }, key) => {
          if (!dataKey) return null;

          const props = {
            ...otherProps,
            nameKey,
            dataKey,
            data: dataPoints
          };

          if (key === 'inner') {
            props.outerRadius = 60;
            props.fill = colors[0];
          } else {
            props.innerRadius = 70;
            props.outerRadius = 90;
            props.fill = colors[1];
            props.label = true;
          }

          return (
            <Pie
              key={props.fill}
              {...props}
            />
          );
        })}
      </PieChart>
    </ResponsiveContainer>
  );
}

function renderColorfulLegend(value, entry) {
  const { color } = entry;
  return <span style={{ color }}>{value}</span>;
}

TwoLevel.displayName = 'Two level pie chart';

TwoLevel.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      properties: {
        inner: {
          type      : 'object',
          properties: {
            data: {
              type : 'array',
              items: {
                source: 'data',
                type  : 'object'
              }
            },
            nameKey: {
              description: 'The column to use as the name source',
              type       : 'string',
              source     : 'column'
            },
            dataKey: {
              description: 'The column to use as the data source',
              type       : 'string',
              source     : 'column',
              sourceType : 'number'
            }
          }
        },
        outer: {
          type      : 'object',
          properties: {
            data: {
              type : 'array',
              items: {
                source: 'data',
                type  : 'object'
              }
            },
            nameKey: {
              description: 'The column to use as the name source',
              type       : 'string',
              source     : 'column'
            },
            dataKey: {
              description: 'The column to use as the data source',
              type       : 'string',
              source     : 'column',
              sourceType : 'number'
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
      type : 'array',
      min  : 2,
      max  : 2,
      items: {
        description: 'The colors to use for the lines',
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

TwoLevel.propTypes = propTypeSchema(TwoLevel.propTypesSchema);

TwoLevel.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLegend     : true,
  withTooltip    : true
};

// export the default
TwoLevel.defaultData = defaultData;

TwoLevel.thumbnail = thumbnail;
