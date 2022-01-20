/* eslint-disable react/prop-types */
import React from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import bindClassnames from 'classnames/bind';
import {
  map as _map,
  pick as _pick
} from 'lodash';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts-gl';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './Bar.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Bar({ chartData: { data, xAxis, yAxis, zAxis }, colors, tooltip, visualMap }) {
  const options = {
    tooltip,
    xAxis3D: {
      type: 'category',
      name: xAxis
    },
    yAxis3D: {
      type: 'category',
      name: yAxis
    },
    zAxis3D: {
      name: zAxis
    },
    grid3D: {},
    visualMap: {
      ...visualMap,
      dimension: zAxis,
      inRange: {
        symbolSize: [0, 100], // makes the side color range a triangle instead of a rectangle
        color: colors
      }
    },
    dataset: {
      dimensions: [xAxis, yAxis, zAxis],
      source    : [
        [xAxis, yAxis, zAxis],
        ..._map(data, row => [row[xAxis], row[yAxis], row[zAxis]])
      ]
    },
    series: [
      {
        type   : 'bar3D',
        shading: 'lambert',
        encode : {
          x      : xAxis,
          y      : yAxis,
          tooltip: [zAxis]
        }
      }
    ]
  };

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={options}
      style={{ height: '100%' }}
      notMerge
      lazyUpdate
      // theme='theme_name'
    />
  );
}

Bar.displayName = '3D bar chart';

Bar.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'xAxis', 'yAxis', 'zAxis'],
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
          description: 'A column to use to display in the yAxis',
          type       : 'string',
          source     : 'column'
        },
        zAxis: {
          description: 'A column to use to display in the zAxis',
          type       : 'string',
          source     : 'column'
        }
      }
    },
    colors: {
      type         : 'array',
      min          : 2,
      max          : 2,
      items        : {
        description: 'The color to use for the line',
        type       : 'string',
        source     : 'colorPicker'
      }
    },
    tooltip: {
      description: 'The options for the tooltip',
      type       : 'object',
      properties : {
        enterable: {
          description: 'Whether the tooltip stays on when the mouse goes over it',
          type       : 'boolean'
        },
        triggerOn: {
          description: 'How the tooltip triggers',
          type       : 'string',
          source     : 'enum',
          enum       : ['mousemove', 'click', 'mousemove|click', 'none']
        }
      }
    },
    // grid3D: {
    //   description: 'Options for the shape, orientation and light on the chart',
    //   type       : 'object'
    // },
    visualMap: {
      description: 'Options for the shape, orientation and light on the chart',
      type       : 'object',
      properties : {
        max: {
          description: 'The maximum value for the color range',
          type       : 'number',
          source     : 'input'
        }
      }
    }
  }
};

Bar.propTypes = propTypeSchema(Bar.propTypesSchema);

Bar.defaultProps = {
  colors: [
    // '#010083',
    // '#0300a9',
    // '#0600e8',
    // '#070dff',
    // '#043dff',
    // '#0171ff',
    // '#00a1fe',
    // '#00d2ff',
    // '#1dfedc',
    // '#44ffb4',
    // '#6efe8a',
    // '#97ff62',
    // '#bfff39',
    // '#e4ff10',
    // '#e4ff10',
    // '#bfff39',
    // '#6efe8a',
    // '#97ff62',
    // '#44ffb4',
    // '#ff5100',
    // '#ff8101',
    '#ffd300',
    '#ff0000',
    // '#fe2200',
    // '#da0303',
    // '#a00000',
    // '#870000'
  ],
  tooltip  : {
    show     : false,
    triggerOn: 'mousemove|click'
  },
  // grid3D   : {},
  visualMap: {
    max      : 100,
    inRange  : {
      symbolSize: [0, 100]
    }
  }
};

// export the default
Bar.defaultData = defaultData;

Bar.thumbnail = thumbnail;
