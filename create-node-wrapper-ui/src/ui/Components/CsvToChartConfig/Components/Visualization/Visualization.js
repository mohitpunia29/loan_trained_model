import React from 'react';
import PropTypes from 'prop-types';
import {
  filter as _filter,
  find as _find,
  get as _get,
  isEmpty as _isEmpty,
  map as _map
} from 'lodash';

import {
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

import configToProps from '../../../../Components/Graphs/utils/configToProps';

export default function Visualization({ data, json, config, chart: Chart }) {
  const dataField = _find(config.fields, ({ type }) => type === 'data');

  if (_isEmpty(config.fields) || !dataField) return <NoData />;

  const chartProps = configToProps({ data, json, config });

  console.log({ data, chartProps });

  const missingFields = _filter(config.required, (required) => {
    return !_get(chartProps, required);
  });

  if (missingFields.length !== 0) return <MissingFields fields={missingFields} />;

  return (
    <div style={{ height: 500 }}>
      <Chart
        {...chartProps}
      />
    </div>
  );
}

Visualization.propTypes = {
  data  : PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  json  : PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape({
    fields  : PropTypes.arrayOf(PropTypes.object),
    required: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  chart: PropTypes.func.isRequired
};

function NoData() {
  return <p>No Data</p>;
}

function MissingFields({ fields }) {
  return (
    <List
      dense
      disablePadding
    >
      {_map(fields, field => (
        <ListItem
          key={field}
        >
          <ListItemText primary={`${field} is required`} />
        </ListItem>
      ))}
    </List>
  );
}

MissingFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired
};
