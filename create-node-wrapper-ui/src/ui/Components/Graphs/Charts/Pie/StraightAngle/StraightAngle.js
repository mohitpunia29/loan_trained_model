/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  PieChart, Pie, Tooltip, Legend
} from 'recharts';

import colorPalette from '../../../../../constants/colorPalettes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function StraightAngle({
  chartData: { data, nameKey, dataKey }, backgroundColor, color, withTooltip, withLegend
}) {
  return (
    <ResponsiveContainer>
      <PieChart style={{ backgroundColor }}>
        {withTooltip && <Tooltip />}
        {withLegend && <Legend formatter={renderColorfulLegend} />}
        <Pie
          nameKey={nameKey}
          dataKey={dataKey}
          startAngle={180}
          endAngle={0}
          data={data}
          outerRadius={80}
          fill={color}
          label
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function renderColorfulLegend(value, entry) {
  const { color } = entry;
  return <span style={{ color }}>{value}</span>;
}

StraightAngle.displayName = 'Straight angle pie chart';

StraightAngle.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'nameKey', 'dataKey'],
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
    backgroundColor: {
      description: 'The color for the background',
      type       : 'string',
      source     : 'colorPicker'
    },
    color: {
      description: 'The color to use for the pie',
      type       : 'string',
      source     : 'colorPicker'
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

StraightAngle.propTypes = propTypeSchema(StraightAngle.propTypesSchema);

StraightAngle.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  color          : colorPalette.get()[0],
  withLegend     : true,
  withTooltip    : true
};

// export the default
StraightAngle.defaultData = defaultData;

StraightAngle.thumbnail = thumbnail;
