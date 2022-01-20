/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import { Sector } from 'recharts';

import colorPalette from '../../../../../constants/colorPalettes';
import TwoLevelPieChart from '../TwoLevel/TwoLevel';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function CustomActiveShape({ chartData, ...props }) {
  const { data, dataKey } = chartData;
  const [activeIndex, setActiveIndex] = useState(0);

  // eslint-disable-next-line no-shadow
  function handlePieEnter(data, index) {
    setActiveIndex(index);
  }

  // eslint-disable-next-line no-param-reassign
  chartData = {
    // inner: {},
    outer: {
      data,
      dataKey,
      activeIndex,
      activeShape : ActiveShape,
      onMouseEnter: handlePieEnter
    }
  };

  return (
    <TwoLevelPieChart
      {...props}
      chartData={chartData}
    />
  );
}

CustomActiveShape.displayName = 'Custom active shape pie chart';

CustomActiveShape.propTypesSchema = {
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
    color: {
      description: 'The color to use for the line',
      type       : 'string',
      source     : 'colorPicker'
    },
    withLegend : TwoLevelPieChart.propTypesSchema.properties.withLegend,
    withTooltip: TwoLevelPieChart.propTypesSchema.properties.withTooltip
  }
};

CustomActiveShape.propTypes = propTypeSchema(CustomActiveShape.propTypesSchema);

CustomActiveShape.defaultProps = {
  color      : colorPalette.get()[0],
  withLegend : TwoLevelPieChart.defaultProps.withLegend,
  withTooltip: TwoLevelPieChart.defaultProps.withTooltip
};

// export the default
CustomActiveShape.defaultData = defaultData;

CustomActiveShape.thumbnail = thumbnail;

function ActiveShape(props) {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill='#333'>{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
}
