/* eslint-disable react/prop-types */
import React from 'react';
import propTypesSchema from 'react-json-schema-proptypes';
import { cloneDeep as _cloneDeep, map as _map } from 'lodash';

import Simple from '../Simple/Simple';

import colorPalette from '../../../../../constants/colorPalettes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function BrushChart(props) {
  return (
    <Simple
      {...props}
      withBrush
    />
  );
}

BrushChart.displayName = 'Brush bar chart';

BrushChart.propTypesSchema = _cloneDeep(Simple.propTypesSchema);
delete BrushChart.propTypesSchema.properties.withBrush;

BrushChart.propTypes = propTypesSchema(BrushChart.propTypesSchema);

BrushChart.defaultProps = {
  backgroundColor: colorPalette.getColor('background'),
  colors         : colorPalette.get(),
  stacked        : false,
  withBrush      : false,
  withLegend     : true,
  withTooltip    : true
};

delete BrushChart.withBrush;

// export the default
BrushChart.defaultData = defaultData;

BrushChart.thumbnail = thumbnail;
