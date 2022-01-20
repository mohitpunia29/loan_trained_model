/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { Typography } from '@material-ui/core';
import propTypeSchema from 'react-json-schema-proptypes';
import { map as _map } from 'lodash';

import * as d3 from 'd3';

import useRefDimensions from '../../../../../Hooks/useRefDimensions';

import colorPalette from '../../../../../constants/colorPalettes';
import colorHexToRbg from '../../../../../utils/colorHexToRgb';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './Simple.module.css';

export default function Simple({ chartData: { data: propData, name, value }, active, backgroundColor, color, withLabel, onClick }) {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const [{ width, height }] = useRefDimensions(rootRef);

  const data = _map(propData, (row) => ({
    name    : row[name],
    value   : row[value],
    color   : row.color,
    category: row.category
  }));

  function pack(dataToPack) {
    return d3.pack()
      .size([width - 2, height - 2])
      .padding(3)(d3.hierarchy({ children: dataToPack })
        .sum((d) => d.value));
  }

  const root = pack(data);

  d3.select(svgRef.current).selectAll('*').remove();

  const svg = d3.select(svgRef.current)
    .style('width', '100%')
    .style('height', 'auto')
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle');

  const tooltip = d3.select(`.${styles.tooltip}`);

  const showTooltip = (d, i) => {
    d3.select(`.leaf-${i}`).attr('fill-opacity', 1);
    tooltip.html(d.data.category ? `<b> Category : </b> ${d.data.category} <br /> <b> Term : </b> ${d.data.name} <br /> <b> Count : </b> ${d.data.value}` : `${d.data.name} <br /> ${d.data.value}`);
    tooltip.style('visibility', 'visible');
  };

  const hideTooltip = (d, i) => {
    d3.select(`.leaf-${i}`).attr('fill-opacity', 0.7);
    tooltip.style('visibility', 'hidden');
  };

  const moveTooltip = () => {
    const topPos = rootRef.current.getBoundingClientRect().top + window.scrollY;
    const leftPos = rootRef.current.getBoundingClientRect().left + window.scrollX;
    tooltip
      .style('top', `${d3.event.pageY - topPos - 40}px`)
      .style('left', `${d3.event.pageX - leftPos + 15}px`);
  };

  const onMouseClick = (d, i) => {
    onClick(d.data.name, d.data.category);
  };

  const leaf = svg.selectAll('g')
    .data(root.leaves())
    .join('g')
    .attr('transform', (d) => `translate(${d.x + 1},${d.y + 1})`);

  leaf.append('circle')
    .attr('id', (d) => (d.leafUid = `leaf${d.data.name}`).id)
    .attr('class', (d, i) => `leaf-${i}`)
    .attr('r', (d) => d.r)
    .attr('fill-opacity', 0.7)
    .attr('fill', (d) => (d.data.color ? d.data.color : color))
    .attr('stroke', (d) => (d.data.name === active ? '#ec9002' : null))
    .attr('stroke-width', '4')
    .on('mouseout', hideTooltip)
    .on('mouseenter', showTooltip)
    .on('mousemove', moveTooltip)
    .on('click', onMouseClick);

  leaf.append('clipPath')
    .attr('id', (d) => (d.clipUid = `clip${d.data.name}`).id)
    .append('use')
    .attr('xlink:href', (d) => d.leafUid.href);

  // eslint-disable-next-line no-lone-blocks
  { withLabel && (leaf.append('text')
    .attr('clip-path', (d) => d.clipUid)
    .selectAll('tspan')
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .join('tspan')
    .attr('x', 0)
    .attr('y', (_d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .attr('fill', colorHexToRbg('#FFFFFF'))
    .text((d) => d)
  );
  }

  svg.node();

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ backgroundColor }}
    >
      <svg ref={svgRef} className={styles.svg} width='100%' />
      <Typography classes={{ root: styles.tooltip }} />
    </div>
  );
}

Simple.displayName = 'Simple bubble chart';

Simple.propTypesSchema = {
  type      : 'object',
  required  : ['chartData'],
  properties: {
    chartData: {
      type      : 'object',
      required  : ['data', 'name', 'value'],
      properties: {
        data: {
          type : 'array',
          items: {
            source: 'data',
            type  : 'object'
          }
        },
        name: {
          description: 'The column to use for the circle description',
          type       : 'string',
          source     : 'column'
        },
        value: {
          description: 'A column to use for the size of the circle',
          type       : 'string',
          source     : 'column'
        }
      }
    },
    backgroundColor: {
      description: 'The background color for the graph',
      type       : 'string',
      source     : 'colorPicker'
    },
    color: {
      description: 'The color to use for the line',
      type       : 'string',
      source     : 'colorPicker'
    },
    withLabel: {
      description: 'Label on the bubbles',
      type       : 'boolean'
    }
  }
};

Simple.propTypes = propTypeSchema(Simple.propTypesSchema);

Simple.defaultProps = {
  active         : null,
  backgroundColor: colorPalette.getColor('background'),
  color          : colorPalette.get()[1],
  withLabel      : true,
  onClick        : () => {}
};

// export the default
Simple.defaultData = defaultData;

Simple.thumbnail = thumbnail;
