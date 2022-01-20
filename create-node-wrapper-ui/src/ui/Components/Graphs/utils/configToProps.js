import {
  cloneDeep as _cloneDeep,
  find as _find,
  get as _get,
  isArray as _isArray,
  map as _map,
  reduce as _reduce,
  set as _set
} from 'lodash';

export default function configToProps({ data, json, config }) {
  const dataField = _find(config.fields, ({ type }) => type === 'data');

  const chartProps = _cloneDeep(data);

  const columnPaths = _reduce(config.fields, (result, val) => {
    if (val.type === 'csvColumn') {
      result.push(val.path);
    }

    return result;
  }, []);

  // console.log({ columnPaths, chartProps });

  const columns = [];
  for (const columnPath of columnPaths) {
    let val = _get(chartProps, columnPath);

    if (!_isArray(val)) {
      val = [val];
    }

    columns.push(..._map(val, name => ({
      name,
      sourceType: _find(config.fields, { path: columnPath }).sourceType
    })));
  }

  // console.log({ dataField, columnPaths, json, columns });

  _set(chartProps, dataField.path, _map(json, (row) => {
    return _reduce(columns, (result, { name, sourceType }) => {
      let rowVal = _get(row, name);

      switch (sourceType) {
        case 'number':
          rowVal = parseInt(rowVal);
          break;
        case 'float':
          rowVal = parseFloat(rowVal);
          break;
        case 'boolean':
            rowVal = rowVal.toLowerCase() === 'true';
          break;
        default:
          break;
      }

      result[name] = rowVal;

      return result;
    }, {});
  }));

  // console.log({ data, chartProps });

  return chartProps;
}
