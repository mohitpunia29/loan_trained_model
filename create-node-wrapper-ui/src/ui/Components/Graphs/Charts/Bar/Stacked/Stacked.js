/* eslint-disable react/prop-types */
import React from 'react';
import propTypesSchema from 'react-json-schema-proptypes';
import { cloneDeep as _cloneDeep, map as _map } from 'lodash';

import Simple from '../Simple/Simple';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

export default function StackedChart(props) {
  return (
    <Simple
      {...props}
      stacked
    />
  );
}

StackedChart.displayName = 'Stacked bar chart';

StackedChart.propTypesSchema = _cloneDeep(Simple.propTypesSchema);
delete StackedChart.propTypesSchema.properties.stacked;

StackedChart.propTypes = propTypesSchema(StackedChart.propTypesSchema);

StackedChart.defaultProps = _cloneDeep(Simple.defaultProps);
delete StackedChart.stacked;

// export the default
StackedChart.defaultData = defaultData;

StackedChart.thumbnail = thumbnail;
