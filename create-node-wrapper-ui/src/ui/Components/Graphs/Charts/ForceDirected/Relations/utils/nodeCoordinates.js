import {
  map as _map,
  sumBy as _sumBy
} from 'lodash';

import { SVG_MARGIN, LINE_SIZE } from '../constants';

export function getNodeAbsoluteCoordinates(node, { texts, boundaries }) {
  if (node.type === 'topic') {
    const topicCoordinates = _map(node.texts, (text) => texts[text].coordinates);

    return {
      x: _sumBy(topicCoordinates, 'x') / topicCoordinates.length,
      y: _sumBy(topicCoordinates, 'y') / topicCoordinates.length
    };
  } else {
    return {
      x: (node.column === 'left' ? boundaries.x[0] : boundaries.x[1]) - SVG_MARGIN,
      y: node.line * LINE_SIZE + 5
    };
  }
}

export function getNodeDragCoordinates({ pageX, pageY, delta }, boundaries) {
  const coordinates = {
    x: pageX - delta.x,
    y: pageY - delta.y
  };

  if (!boundaries) return coordinates;

  return{
    x: Math.min(Math.max(boundaries.x[0], pageX - delta.x), boundaries.x[1]),
    y: Math.min(Math.max(boundaries.y[0], pageY - delta.y), boundaries.y[1])
  }
}
