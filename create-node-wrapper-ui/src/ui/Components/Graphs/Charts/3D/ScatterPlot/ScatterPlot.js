/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import bindClassnames from 'classnames/bind';

// https://github.com/plotly/react-plotly.js/blob/master/README.md#customizing-the-plotlyjs-bundle
import Plotly from 'plotly.js-gl3d-dist';
import createPlotlyComponent from 'react-plotly.js/factory';

import colorPalette from '../../../../../constants/colorPalettes';
import useRefDimensions from '../../../../../Hooks/useRefDimensions';
import propTypeSchema from 'react-json-schema-proptypes';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './ScatterPlot.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const MIN_MARKER_DIAMETER = 30;
const MAX_MARKER_DIAMETER = 70;

const Plot = createPlotlyComponent(Plotly);

export default function ScatterPlot({ chartData: { traces, xAxis, yAxis, zAxis, size }, markers, config, layout, showTooltip }) {
  const rootRef = useRef(null);
  const [{ width, height }] = useRefDimensions(rootRef);
  if (width && height) {
    layout.width = width;
    layout.height = height;
  }

  const data = traces.map((trace, index) => {
    const x = [];
    const y = [];
    const z = [];
    const s = [];
    const meta = [];

    trace.data.forEach((point) => {
      x.push(point[xAxis]);
      y.push(point[yAxis]);
      z.push(point[zAxis]);
      s.push(point[size]);
      meta.push(createHover(point));
    });

    if ((index < markers.length) && markers[index].variableSize) {
      markers[index].size = s;
      markers[index].sizeref = 0.1;
      markers[index].sizemode = 'area';
      markers[index].sizemin = MIN_MARKER_DIAMETER;
    }

    function createHover(point) {
      let hover = '';
      if (!point.hover) {
        hover = `<div style="text-align:left;">${xAxis}: ${point[xAxis]}</div><br>` +
                `<div style="text-align:left;">${yAxis}: ${point[xAxis]}</div><br>` +
                `<div style="text-align:left;">${zAxis}: ${point[xAxis]}</div><br>`;
      } else {
        Object.keys(point.hover).forEach((key) => {
          const isDolar = ['Aggregate Trim Cost', 'Aggregate Fabric Cost', 'Aggregate Packaging Cost'].includes(key);
          hover += `${key}: ${isDolar ? '$' : ''}${point.hover[key]}<br>`;
        });
      }
      if (!showTooltip) hover = '';
      return `${hover}<extra></extra>`;
    }

    return {
      x,
      y,
      z,
      meta,
      text         : s,
      opacity      : 0.6,
      type         : 'scatter3d',
      name         : trace.name,
      mode         : 'markers',
      marker       : index < markers.length ? markers[index] : markers[0],
      hovertemplate: `%{meta}`,
      hoverformat  : '.2f'
    };
  });

  return (
    <div
      ref={rootRef}
      className={classnames('root')}
    >
      <Plot
        data={data}
        config={config}
        layout={layout}
      />
    </div>
  );
}

ScatterPlot.displayName = '3D Scatter Plot';

ScatterPlot.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['traces', 'xAxis', 'yAxis', 'zAxis', 'size'],
      properties: {
        traces: {
          type : 'array',
          items: {
            source    : 'data',
            type      : 'object',
            required  : ['data', 'name'],
            properties: {
              data: {
                type : 'array',
                items: {
                  type  : 'object',
                  source: 'data'
                }
              },
              name: {
                type  : 'string',
                source: 'data'
              }
            }
          }
        },
        xaxis: {
          description: 'A column to use to display in the xAxis',
          type       : 'string',
          source     : 'column'
        },
        yaxis: {
          description: 'A column to use to display in the yAxis',
          type       : 'string',
          source     : 'column'
        },
        zaxis: {
          description: 'A column to use to display in the zAxis',
          type       : 'string',
          source     : 'column'
        },
        size: {
          description: 'A column corresponding to the size of a marker',
          type       : 'string',
          source     : 'column'
        }
      }
    }
  }
};

ScatterPlot.propTypes = propTypeSchema(ScatterPlot.propTypesSchema);

ScatterPlot.defaultProps = {
  markers: colorPalette.get().map((color) => ({
    symbol      : 'circle',
    color,
    opacity     : 0.9,
    variableSize: true
  })),
  config: {
    displayModeBar        : false,
    displaylogo           : false,
    modeBarButtonsToRemove: ['']
  },
  layout: {
    width : 700,
    height: 700,
    margin: {
      l  : 0,
      r  : 10,
      b  : 10,
      t  : 0,
      pad: 0
    },
    legend: {
      x: 0.9,
      y: 0
    },
    scene: {
      xaxis: {
        title: {
          text    : 'x Axis',
          zeroline: false
        }
      },
      yaxis: {
        title: {
          text    : 'y Axis',
          zeroline: false
        }
      },
      zaxis: {
        title: {
          text    : 'z Axis',
          zeroline: false
        }
      }
    }
  },
  showTooltip: true
};

// export the default
ScatterPlot.defaultData = defaultData;

ScatterPlot.thumbnail = thumbnail;
