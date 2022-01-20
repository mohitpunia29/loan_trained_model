/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import PropTypes from 'prop-types';

import uuid from 'uuid/v4';
import {
  ResponsiveContainer,
  BarChart, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush
} from 'recharts';
import { map as _map } from 'lodash';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

// Magic number to multiply a legend/unit letter by, to get its size in pixel
const TEXT_SIZE_PIXEL = 7;

export default function Simple({
  chartData: { data, xAxis, yAxis }, layout, transparency, backgroundColor, colors, stacked, xLabelRotate,
  withBrush, withTooltip, withLegend, withCartesian, axisLine, tick, customToolTip
}) {
  const [stateColors, setStateColors] = useState(colors);
  const IS_LAYOUT_HORIZONTAL = layout === 'horizontal';
  const colorBars = data.length && data[0].color;

  const iniqueId = uuid().split('-')[0];

  return (
    <ResponsiveContainer>
      <BarChart
        layout={layout}
        data={data}
        margin={{
          top   : withBrush ? 50 : 20,
          right : withBrush ? 90 : 30,
          left  : 20,
          bottom: 5 + (
            IS_LAYOUT_HORIZONTAL && xLabelRotate ?
              Math.max(..._map(data, (point) => point[xAxis].length)) * TEXT_SIZE_PIXEL :
              0
          )
        }}
      >
        <defs>
          {_map(stateColors, (color, index) => (
            <linearGradient
              key={`simple-${color}-${index}`}
              id={`color-${iniqueId}-${index}`}
              x1='0'
              y1='0'
              x2={IS_LAYOUT_HORIZONTAL ? '0' : '1'}
              y2={IS_LAYOUT_HORIZONTAL ? '1' : '0'}
            >
              <stop offset='100%' stopColor={color} stopOpacity={IS_LAYOUT_HORIZONTAL ? 1 : transparency} />
              <stop offset='100%' stopColor={color} stopOpacity={IS_LAYOUT_HORIZONTAL ? transparency : 1} />
            </linearGradient>
          ))}
        </defs>
        {withCartesian && <CartesianGrid strokeDasharray='3 3' fill={backgroundColor} />}
        {/* [Horizontal] */}
        {IS_LAYOUT_HORIZONTAL && <XAxis dataKey={xAxis} interval={xLabelRotate ? 0 : null} tick={xLabelRotate && <VerticalAxisTick />} axisLine={axisLine} />}
        {IS_LAYOUT_HORIZONTAL && <YAxis axisLine={axisLine} tick={tick} />}
        {/* [Vertical] We need to specify the type in vertical layout to override the default value for type */}
        {!IS_LAYOUT_HORIZONTAL && <XAxis type='number' axisLine={axisLine} tick={tick} />}
        {!IS_LAYOUT_HORIZONTAL && <YAxis type='category' dataKey={xAxis} axisLine={axisLine} interval={0} tick={xLabelRotate && <VerticalAxisTick horizontal />} /> }
        {withTooltip && <Tooltip cursor={{ fill: 'transparent' }} content={customToolTip} />}
        {withLegend && <Legend wrapperStyle={{ bottom: 5 }} />}
        {withBrush && <Brush dataKey={xAxis} height={30} stroke={colors[0]} y={xLabelRotate ? 10 : null} />}
        {_map(yAxis, (yAxisDataKey, index) => (
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          <Bar
            key={yAxisDataKey}
            dataKey={yAxisDataKey}
            fill={`url(#color-${iniqueId}-${index})`}
            stackId={stacked ? 'a' : undefined}
          >
            {colorBars && data.map((category, indx) => (
              <Cell cursor='pointer' fill={category.color} opacity={0.7} key={`cell-${indx}`} />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

Simple.displayName = 'Simple bar chart';

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
    layout: {
      description: 'The layout of bars in the chart',
      type       : 'string',
      source     : 'enum',
      enum       : ['horizontal', 'vertical']
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
        description: 'The color to use for the line',
        type       : 'string',
        source     : 'colorPicker'
      }
    },
    stacked: {
      displayName: 'stacked',
      description: 'Display all the bars one on top of the other',
      type       : 'boolean'
    },
    xLabelRotate: {
      displayName: 'xLabelRotate',
      description: 'Rotate the label on the xAxis',
      type       : 'boolean'
    },
    withBrush: {
      displayName: 'brush',
      description: 'Display a zone with a cursor to refine the area',
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
    },
    withCartesian: {
      displayName: 'cartesian',
      description: 'Display the cartesian grid',
      type       : 'boolean'
    },
    axisLine: {
      displayName: 'Axis Line',
      description: 'Display the Axis line',
      type       : 'boolean'
    },
    tick: {
      displayName: 'Axis Ticks',
      description: 'Display the Axis Tick',
      type       : 'boolean'
    }
  }
};

Simple.propTypes = {
  ...propTypeSchema(Simple.propTypesSchema),
  customToolTip: PropTypes.func
};

Simple.defaultProps = {
  layout         : 'horizontal',
  transparency   : 0.2,
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  stacked        : false,
  withBrush      : false,
  withLegend     : true,
  withTooltip    : true,
  withCartesian  : true,
  axisLine       : true,
  tick           : true,
  customToolTip  : null
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;

class VerticalAxisTick extends React.PureComponent {
  render() {
    const { x, y, fill, payload, horizontal } = this.props;
    let dx = 0;
    let dy = 5;
    if (horizontal) {
      dx = (payload.value.length / 2) * TEXT_SIZE_PIXEL;
      dy = -10;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={dy} dx={dx} textAnchor='end' fill={fill} transform='rotate(-90)'>{payload.value}</text>
      </g>
    );
  }
}
