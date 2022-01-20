/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  filter as _filter,
  isEmpty as _isEmpty,
  isFinite as _isFinite,
  isString as _isString,
  map as _map,
  reduce as _reduce,
  uniq as _uniq
} from 'lodash';
import bindClassnames from 'classnames/bind';

import colorHexToRgb from '../../../../../utils/colorHexToRgb';
import colorPalette from '../../../../../constants/colorPalettes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './Simple.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Simple({
  chartData: { data, xAxis, yAxis, value },
  color,
  min, max,
  reverseHeat,
  yLabels, xLabels,
  yLabelWidth, yLabelTextAlign, yLabelRightSpacing,
  xLabelRotate,
  cellWidth, cellHeight,
  spacing,
  missingValuePlaceholder,
  prefix, suffix
}) {
  if (_isString(yLabels)) yLabels = _filter(yLabels.split(','), filterLabel);
  if (_isString(xLabels)) xLabels = _filter(xLabels.split(','), filterLabel);

  yLabels = !_isEmpty(yLabels) ? yLabels : _uniq(_map(data, yAxis));
  xLabels = !_isEmpty(xLabels) ? xLabels : _uniq(_map(data, xAxis));

  const dataPoints = _reduce(data, (result, point) => {
    if (!result[point[yAxis]]) {
      result[point[yAxis]] = {};
    }
    point[value] = parseInt(point[value]);
    result[point[yAxis]][point[xAxis]] = point[value];
    min = Math.min(min, point[value]);
    max = Math.max(max || 0, point[value]);

    return result;
  }, {});

  function getCellBackgroundColor(value) {
    const scaledValue = (max - value) / (max - min);

    if (reverseHeat) return scaledValue;

    return 1 - scaledValue;
  }

  return (
    <div className={classnames('root')}>
      <div
        className={classnames('yLabels')}
        style={{
          width      : yLabelWidth,
          marginRight: yLabelRightSpacing
        }}
      >
        {_map(yLabels, yLabel => (
          <div
            key={yLabel}
            className={classnames('yLabel')}
            style={{
              height      : cellHeight,
              textAlign   : yLabelTextAlign,
              marginBottom: spacing
            }}
          >
            <span className={classnames('ellipsis')}>{yLabel}</span>
          </div>
        ))}
      </div>
      <div
        className={classnames('container')}
        style={{
          marginBottom: spacing
        }}
      >
        {_map(yLabels, yLabel => (
          <div
            key={yLabel}
            className={classnames('valueRow')}
            style={{
              marginBottom: spacing
            }}
          >
            {_map(xLabels, xLabel => (
              <div
                key={xLabel}
                className={classnames('cell')}
                style={{
                  height    : cellHeight,
                  width     : cellWidth,
                  marginLeft: spacing
                }}
              >
                {dataPoints[yLabel] && _isFinite(dataPoints[yLabel][xLabel]) ? (
                  <span
                    style={{
                      backgroundColor: colorHexToRgb(color, getCellBackgroundColor(dataPoints[yLabel][xLabel]))
                    }}
                  >
                    {`${prefix}${dataPoints[yLabel][xLabel]}${suffix}`}
                  </span>
                ) : (
                  <span>
                    {missingValuePlaceholder}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
        <div
          className={classnames('xLabels', {
            xLabelsFlipped: xLabelRotate
          })}
        >
          {_map(xLabels, xLabel => (
            <div
              key={xLabel}
              className={classnames('xLabel', {
                xLabelFlipped: xLabelRotate
              })}
              style={{
                width       : xLabelRotate ? undefined : cellWidth,
                height      : xLabelRotate ? cellWidth : undefined,
                marginLeft  : xLabelRotate ? 0         : spacing,
                marginBottom: xLabelRotate ? spacing   : 0,
                paddingRight: xLabelRotate ? spacing   : 0
              }}
            >
              <span
                className={classnames('ellipsis')}
              >
                {xLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Simple.displayName = 'Simple Heatmap chart';

Simple.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'xAxis', 'yAxis', 'value'],
      properties: {
        data: {
          type : 'array',
          items: {
            source: 'data',
            type  : 'object'
          }
        },
        yAxis: {
          description: 'A column to use to display in the yAxis',
          type       : 'string',
          source     : 'column'
        },
        xAxis: {
          description: 'The column to use to display the xAxis',
          type       : 'string',
          source     : 'column'
        },
        value: {
          description: 'A column to use to display as the value for the cells',
          type       : 'string',
          source     : 'column'
        }
      }
    },
    color: {
      description: 'The color to use to shade the heatmap',
      type       : 'string',
      source     : 'colorPicker'
    },
    reverseHeat: {
      description: 'Set if you want the min value to be colored and max to be white',
      type       : 'boolean',
      source     : 'boolean'
    },
    min: {
      description: 'The minimum value',
      type       : 'number',
      source     : 'input'
    },
    max: {
      description: 'The maximum value',
      type       : 'number',
      source     : 'input'
    },
    xLabels: {
      description: 'The list of labels for the x axis (comma separated)',
      type       : ['array', 'string'],
      source     : 'input',
      items      : {
        type: 'string'
      }
    },
    yLabels: {
      description: 'The list of labels for the y axis (comma separated)',
      type       : ['array', 'string'],
      source     : 'input',
      items      : {
        type: 'string'
      }
    },
    yLabelWidth: {
      description: 'The width of a cell',
      type       : 'number',
      source     : 'input'
    },
    yLabelTextAlign: {
      description: 'The width of a cell',
      type       : 'string',
      source     : 'enum',
      enum       : ['left', 'right']
    },
    yLabelRightSpacing: {
      description: 'The margin to the right of the yLabel',
      type       : 'number',
      source     : 'input'
    },
    xLabelRotate: {
      description: 'Display the xLabel sideways',
      type       : 'boolean',
      source     : 'boolean'
    },
    cellWidth: {
      description: 'The width of a cell',
      type       : 'number',
      source     : 'input'
    },
    cellHeight: {
      description: 'The height of a cell',
      type       : 'number',
      source     : 'input'
    },
    spacing: {
      description: 'The space between cells and axis',
      type       : 'number',
      source     : 'input'
    },
    missingValuePlaceholder: {
      description: 'The content of the cell when the value is missing',
      type       : 'string',
      source     : 'input'
    },
    prefix: {
      description: 'The content to put before the cell value',
      type       : 'string',
      source     : 'input'
    },
    suffix: {
      description: 'The content to put after the cell value',
      type       : 'string',
      source     : 'input'
    }
  }
};

Simple.propTypes = propTypeSchema(Simple.propTypesSchema);

Simple.defaultProps = {
  color                  : colorPalette.get()[0],
  min                    : 0,
  max                    : undefined,
  reverseHeat            : false,
  xLabels                : undefined,
  yLabels                : undefined,
  yLabelWidth            : undefined,
  yLabelRightSpacing     : 3,
  xLabelRotate           : false,
  yLabelTextAlign        : 'right',
  cellWidth              : 30,
  cellHeight             : 30,
  spacing                : 1,
  missingValuePlaceholder: '-',
  prefix                 : '',
  suffix                 : ''
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;

function filterLabel(label) {
  return label || label === 0;
}
