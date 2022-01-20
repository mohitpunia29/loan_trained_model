import React from 'react';
import PropTypes from 'prop-types';

import { SVG_MARGIN, LINE_SIZE } from '../../constants';

import Node from '../Node/Node';

export default function SourceText({ isRight, title, line, score, nodeStroke, nodeFill, onMouseEnter, onMouseLeave }) {
  const ScoreCircle = (
    <Node
      x={isRight ? SVG_MARGIN : -SVG_MARGIN}
      y={-5}
      r={score}
      stroke={nodeStroke}
      fill={nodeFill}
    />
  );

  return (
    <g
      key={title}
      transform={`translate(0, ${LINE_SIZE * line})`}
      onMouseEnter={() => onMouseEnter(title)}
      onMouseLeave={onMouseLeave}
    >
      {!isRight && ScoreCircle}
      <text
        dx={(isRight ? 1 : -1) * (score * 2 + SVG_MARGIN + 5)}
        textAnchor={isRight ? 'start' : 'end'}
      >
        {title}
      </text>
      {isRight && ScoreCircle}
    </g>
  );
}

SourceText.propTypes = {
  isRight     : PropTypes.bool,
  title       : PropTypes.string.isRequired,
  line        : PropTypes.number.isRequired,
  score       : PropTypes.number.isRequired,
  nodeStroke  : PropTypes.string,
  nodeFill    : PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

SourceText.defaultProps = {
  isRight     : false,
  nodeStroke  : undefined,
  nodeFill    : undefined,
  onMouseEnter: () => {},
  onMouseLeave: () => {}
};
