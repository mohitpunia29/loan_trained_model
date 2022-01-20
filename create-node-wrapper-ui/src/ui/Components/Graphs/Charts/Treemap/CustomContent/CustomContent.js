import React from 'react';
import PropTypes from 'prop-types';

import SimpleTreemap from '../Simple/Simple';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

function CustomizedContent({ root, depth, x, y, width, height, index, payload, colors, rank, name }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill         : depth < 2 ? colors[Math.floor(index / root.children.length * 6)] : 'none',
          stroke       : '#fff',
          strokeWidth  : 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
      />
      {
        depth === 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor='middle'
            fill='#fff'
            fontSize={14}
          >
            {name}
          </text>
        ) : null
      }
      {
        depth === 1 ? (
          <text
            x={x + 4}
            y={y + 18}
            fill='#fff'
            fontSize={16}
            fillOpacity={0.9}
          >
            {index + 1}
          </text>
        ) : null
      }
    </g>
  );
}

export default function CustomContent(props) {
  const { colors } = props;

  return (
    <SimpleTreemap
      {...props}
      content={<CustomizedContent colors={colors} />}
    />
  );
}

CustomContent.displayName = 'Custom content treemap chart';

CustomContent.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string)
};

CustomContent.defaultProps = {
  colors: colorPalette.get()
};

// export the default
CustomContent.defaultData = defaultData;

CustomContent.thumbnail = thumbnail;
