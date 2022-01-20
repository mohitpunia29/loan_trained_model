import React from 'react';
import PropTypes from 'prop-types';
import { map as _map } from 'lodash';

import { SVG_MARGIN, LINE_SIZE } from '../../constants';

import SourceText from '../SourceText/SourceText';

const Column = React.forwardRef(({
  nodes, x, width, isRight, nodeStroke, nodeFill,
  onNodeMouseEnter, onNodeMouseLeave
}, ref) => {
  if (nodes.length === 0) return null;

  return (
    <g
      transform={`translate(${!isRight ? width + SVG_MARGIN : x - width - SVG_MARGIN}, ${LINE_SIZE})`}
      ref={ref}
    >
      {_map(nodes, ({ score, title, line }) => (
        <SourceText
          key={title}
          title={title}
          line={line}
          score={score}
          isRight={isRight}
          nodeStroke={nodeStroke}
          nodeFill={nodeFill}
          onMouseEnter={onNodeMouseEnter}
          onMouseLeave={onNodeMouseLeave}
        />
      ))}
    </g>
  );
});

Column.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    score: PropTypes.number
  })).isRequired,
  x               : PropTypes.number,
  width           : PropTypes.number.isRequired,
  isRight         : PropTypes.bool,
  nodeStroke      : PropTypes.string,
  nodeFill        : PropTypes.string,
  onNodeMouseEnter: PropTypes.func,
  onNodeMouseLeave: PropTypes.func
};

Column.defaultProps = {
  x               : 0,
  isRight         : false,
  nodeStroke      : undefined,
  nodeFill        : undefined,
  onNodeMouseEnter: () => {},
  onNodeMouseLeave: () => {}
};

export default Column;
