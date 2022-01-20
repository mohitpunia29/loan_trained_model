/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-multi-spaces */
import {
  uniqWith as _uniqWith,
  isEqual as _isEqual
} from 'lodash';

import { OFFSET, GRAPH } from './SvgElements/constants';

/**
 * Returns the center based on the layer
 *
 * @function  getCenter
 * @param     width             width of SVG
 * @param     height            height of SVG
 * @param     layer             layer of node
 * @param     layers            count of all layers
 * @param     padding           between layers
 * @return    {Object}
 */
const getCenter = (width, height, layer, layers, padding) => {
  const vHeight = height > GRAPH.min_height ? height : GRAPH.min_height;
  const maxHeight = vHeight - 2 * padding;
  const step = maxHeight / layers.length;
  const y = maxHeight - layer * step - padding;

  return {
    x: width / 2,
    y
  };
};

/**
 * Returns layers with number of nodes
 *
 * @function  getLayers
 * @param     nodes             array of nodes
 * @return    {Array}
 */
const getLayers = (nodes) => {
  const layers = [];
  nodes.forEach((node) => {
    if (Array.isArray(layers[node.layer])) {
      layers[node.layer].push(node);
    } else {
      layers[node.layer] = [node];
    }
  });

  return layers;
};

const linksWeight = (id, links) => links.filter((link) => link[0] === id || link[1] === id).length;

/**
 * Creates the appropriate dataSet for the StructureGraph
 *
 * @function  createDataset
 * @param     nodes             Array of nodes
 * @param     links             Array of relations of nodes
 * @param     width             width of SVG element
 * @param     offsetX           X axis offset rotation
 * @param     offsetY           Ellipse coefficient offset
 * @return    {Action}
 */
export const createDataset = (nodes, links, width, height, offsetX, offsetY) => {
  const baseCOEFF = OFFSET.COEFF.base;
  const minCOEFF  = OFFSET.COEFF.min;
  const maxCOEFF  = OFFSET.COEFF.max;
  const proposedCOEFF = baseCOEFF - offsetY;
  // eslint-disable-next-line no-nested-ternary
  const coeff   = proposedCOEFF > minCOEFF ? proposedCOEFF < maxCOEFF ? proposedCOEFF : maxCOEFF : minCOEFF;
  const layers  = getLayers(nodes);
  const indexes = layers.map(() => 0);

  // transformed nodes
  const trNodes = nodes.map((node) => {
    // eslint-disable-next-line no-plusplus
    const index   = ++indexes[node.layer];
    const step    = 2 * Math.PI / layers[node.layer].length;
    const center  = getCenter(width, height, node.layer, layers, GRAPH.height_padding);
    const rIdeal  = layers[node.layer].length * 10;
    const r       = rIdeal < width / 2 - GRAPH.width_padding  ? rIdeal : width / 2 - GRAPH.width_padding;
    const radius  = linksWeight(node.id, links);
    const factor  = step * index + step * Math.floor(offsetX);
    return {
      transformations: {
        x          : center.x + r * Math.cos(factor),
        y          : center.y + coeff * r * Math.sin(factor),
        center,
        rotate     : Math.cos(factor) > 0 ? factor / (Math.PI / 180) : (Math.PI + factor) / (Math.PI / 180),
        orientation: Math.cos(factor) > 0 ? 'right' : 'left'
      },
      content: {
        label      : node.label,
        color      : node.color,
        id         : node.id,
        layer      : node.layer,
        // eslint-disable-next-line no-nested-ternary
        radius     : radius > 3 ? radius > 10 ? 10 : radius : 3,
        description: `field:${node.label} column:${node.column} layer:${node.layer} ID:${node.id}`,
        modalPairs : node.modal || null
      }
    };
  });

  // transformed links
  const trLinks = _uniqWith(links, _isEqual).map((pair) => ([
    trNodes.filter((node) => node.content.id === pair[0])[0],
    trNodes.filter((node) => node.content.id === pair[1])[0]
  ]));

  return {
    nodes: trNodes.sort((a, b) => a.content.layer - b.content.layer),
    links: trLinks,
    layers
  };
};
