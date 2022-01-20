/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';

import Stacked from '../Stacked/Stacked';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function Simple({ chartData: { yAxis, ...otherChartData }, color, ...props }) {
  return (
    <Stacked
      {...props}
      chartData={{
        ...otherChartData,
        yAxis: [yAxis]
      }}
      colors={[color]}
    />
  );
}

Simple.displayName = 'Simple area chart';

// See Stacked for more info on the props
Simple.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'xAxis', 'yAxis'],
      properties: {
        data: Stacked.propTypesSchema.properties.chartData.properties.data,
        xAxis: Stacked.propTypesSchema.properties.chartData.properties.xAxis,
        yAxis: Stacked.propTypesSchema.properties.chartData.properties.yAxis.items
      }
    },
    color      : Stacked.propTypesSchema.properties.colors.items,
    withLegend : Stacked.propTypesSchema.properties.withLegend,
    withTooltip: Stacked.propTypesSchema.properties.withTooltip
  }
};

Simple.propTypes = propTypeSchema(Simple.propTypesSchema);

Simple.defaultProps = {
  color      : Stacked.defaultProps.colors[0],
  withLegend : Stacked.defaultProps.withLegend,
  withTooltip: Stacked.defaultProps.withTooltip
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;
