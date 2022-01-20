/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  ResponsiveContainer,
  Radar, RadarChart, PolarGrid, Tooltip, Legend,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  map as _map
} from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function SpecifiedDomain({
  chartData: { data, dataKey, areas }, domain, angle, radius, backgroundColor, colors, withTooltip, withLegend, withTicks
}) {
  return (
    <ResponsiveContainer>
      <RadarChart outerRadius={radius} data={data} style={{ backgroundColor }}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey={dataKey}
          stroke={backgroundColor !== '#FFFFFF' ? 'white' : 'lightgrey'}
          tick={withTicks}
        />
        <PolarRadiusAxis angle={angle} domain={domain} />
        {withTooltip && <Tooltip contentStyle={{ textAlign: 'left' }} />}
        {withLegend && <Legend formatter={renderColorfulLegend} />}
        {_map(areas, (area, index) => (
          <Radar
            key={area.dataKey}
            name={area.name}
            dataKey={area.dataKey}
            stroke={colors[index]}
            fill={colors[index]}
            fillOpacity={area.opacity}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}

function renderColorfulLegend(value, entry) {
  const { color } = entry;
  return <span style={{ color }}>{value}</span>;
}

SpecifiedDomain.displayName = 'Specified domain radar chart';

SpecifiedDomain.propTypesSchema = {
  type      : 'object',
  required  : ['chartData', 'domain', 'angle'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'dataKey', 'areas'],
      properties: {
        data: {
          type : 'array',
          items: {
            source: 'data',
            type  : 'object'
          }
        },
        dataKey: {
          description: 'The column to use as the data source',
          type       : 'string',
          source     : 'column'
        },
        areas: {
          type : 'array',
          items: {
            type      : 'object',
            properties: {
              dataKey: {
                description: 'The column to use as the data source',
                type       : 'string',
                source     : 'column'
              },
              name: {
                description: 'Name of the area',
                type       : 'string',
                source     : 'input'
              },
              color: {
                description: 'The color to use for the line',
                type       : 'string',
                source     : 'colorPicker'
              },
              opacity: {
                type  : 'number',
                source: 'input'
              }
            }
          }
        }
      }
    },
    domain: {
      type    : 'array',
      minItems: 2,
      maxItems: 2,
      items   : {
        description: 'The angle',
        type       : 'number',
        source     : 'input'
      }
    },
    angle: {
      description: 'The angle',
      type       : 'number',
      source     : 'input'
    },
    radius: {
      description: 'Radar\'s radius',
      type       : ['number', 'string'],
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
      exactItemsRef: '#chartData.areas.length',
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
    withTicks: {
      displayName: 'ticks',
      description: 'Shows ticks and labels on axis',
      type       : 'boolean'
    }
  }
};

SpecifiedDomain.propTypes = propTypeSchema(SpecifiedDomain.propTypesSchema);

SpecifiedDomain.defaultProps = {
  domain         : [0, 150],
  angle          : 30,
  radius         : '80%',
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  withLegend     : true,
  withTooltip    : true,
  withTicks      : true
};

// export the default
SpecifiedDomain.defaultData = defaultData;

SpecifiedDomain.thumbnail = thumbnail;
