import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  RadialBarChart, RadialBar, Tooltip, Legend
} from 'recharts';

import colorPalette from '../../../../../constants/colorPalettes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function Simple({
  chartData: { data, nameKey, dataKey }, backgroundColor, colors, minAngle, barSize, withTooltip, withLegend
}) {
  const dataWithColors = data.map((row, index) => ({
    ...row,
    fill: colors[index]
  }));

  return (
    <ResponsiveContainer>
      <RadialBarChart
        data={dataWithColors}
        innerRadius={20}
        outerRadius={140}
        barSize={barSize}
        style={{ backgroundColor }}
      >
        <RadialBar
          nameKey={nameKey}
          dataKey={dataKey}
          minAngle={minAngle}
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          clockWise
        />
        {withTooltip && <Tooltip />}
        {withLegend && <Legend formatter={renderColorfulLegend} />}
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

function renderColorfulLegend(value, entry) {
  const { color } = entry;
  return <span style={{ color }}>{value}</span>;
}

Simple.displayName = 'Simple radial chart';

Simple.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'dataKey'],
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
    minAngle: {
      description: 'The angle of the rotation',
      type       : 'number',
      source     : 'input'
    },
    barSize: {
      description: 'The width of the bars',
      type       : 'number',
      source     : 'input'
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
  minAngle       : 15,
  barSize        : 40,
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLegend     : true,
  withTooltip    : true
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;
