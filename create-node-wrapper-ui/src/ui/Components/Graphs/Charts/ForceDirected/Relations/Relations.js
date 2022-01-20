import React, { useState, useEffect, useRef } from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import {
  forEach as _forEach,
  map as _map
} from 'lodash';
import bindClassnames from 'classnames/bind';

import { SVG_MARGIN } from './constants';
import useRefDimensions from '../../../../../Hooks/useRefDimensions';
import { getNodeAbsoluteCoordinates, getNodeDragCoordinates } from './utils/nodeCoordinates';

import Node from './Components/Node/Node';
import Column from './Components/Column/Column';
import Edge from './Components/Edge/Edge';

import colorPalette from '../../../../../constants/colorPalettes';
import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './Relations.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Relations({
  chartData: { data, name, value },
  sourceTextStrokeColor, sourceTextFillColor, topicStrokeColor, topicFillColor
}) {
  const [{ texts, topics, edges }, setState] = useState({ texts: [], topics: [], edges: [] });
  const [dragState, setDragState] = useState(null);
  const [hoveredNode, setHoveredNode] = useState();

  const rootRef = useRef(null);
  const [{ width, height }] = useRefDimensions(rootRef);

  const leftColumnRef = useRef(null);
  const [{ width: leftColumnWidth }] = useRefDimensions(leftColumnRef, { isSvg: true });

  const rightColumnRef = useRef(null);
  const [{ width: rightColumnWidth }] = useRefDimensions(rightColumnRef, { isSvg: true });

  // the boundaries of the svg
  const boundaries = {
    x: [leftColumnWidth, width - rightColumnWidth],
    y: [0, height]
  };

  // Create the nodes and edges
  useEffect(() => {
    const texts = {};
    const topics = {};

    _forEach(data, (val) => {
      const valName = val[name];
      const valTopic = val[value];

      if (!topics[valTopic]) {
        topics[valTopic] = {
          type : 'topic',
          title: valTopic,
          edges: [],
          score: 0,
          texts: []
        };
      }
      topics[valTopic].score++;

      if (!texts[valName]) {
        texts[valName] = {
          type    : 'text',
          title   : valName,
          edges   : [],
          score   : 0,
          topics: []
        };
      }
      texts[valName].score++;
      texts[valName].topics.push(valTopic);

      topics[valTopic].texts.push(valName);
    });
    const textsArray = Object.values(texts);

    const edges = {};

    for (let i = 0; i < textsArray.length; i++) {
      const text = textsArray[i];
      text.line = Math.floor(i / 2);

      if (i % 2 === 0) {
        textsArray[i].column = 'left';
      } else {
        textsArray[i].column = 'right';
      }

      for (const topic of text.topics) {
        const edge = {
          id         : text.title + topics[topic].title,
          source     : text.title,
          destination: topics[topic].title
        };
        edges[edge.id] = edge;
        text.edges.push(edge.id);
        topics[topic].edges.push(edge.id);
      }
    }

    setState({ topics, texts, edges });
  }, [data, name, value]);

  // Calculate the points coordinates
  useEffect(() => {
    setState(({ texts, topics, ...remainingState }) => {
      _forEach(texts, (text) => {
        text.coordinates = getNodeAbsoluteCoordinates(text, { boundaries });
      });
      _forEach(topics, (topic) => {
        topic.coordinates = getNodeAbsoluteCoordinates(topic, { texts, boundaries });
      });

      return {
        texts,
        topics,
        ...remainingState
      };
    });
  }, [data, name, value, width, leftColumnWidth, rightColumnWidth]);

  useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragState]);

  useEffect(() => {
    if (dragState) {
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  function handletopicMouseDown(event, topicId) {
    // so that the text around are not getting highlighted when the mouse moves
    event.preventDefault();

    const { pageX, pageY } = event;

    const topic = topics[topicId];

    setDragState({
      active: topic.title,
      delta : {
        x: pageX - topic.coordinates.x,
        y: pageY - topic.coordinates.y
      }
    });
  }

  function handleMouseMove(event) {
    if (!dragState) return;

    const { pageX, pageY } = event;
    const { active, delta } = dragState;

    setState(({ topics, ...remainingState }) => ({
      ...remainingState,
      topics: {
        ...topics,
        [active]: {
          ...topics[active],
          coordinates: getNodeDragCoordinates({ pageX, pageY, delta }, {
            x: [boundaries.x[0], boundaries.x[1] - 2 * SVG_MARGIN],
            y: [boundaries.y[0], boundaries.y[1] - SVG_MARGIN - (topics[active].score * 2)]
          })
        }
      }
    }));
  }

  function handleMouseUp() {
    if (!dragState) return;

    // remove the mousemove listener, otherwise it may trigger again after mouseup
    document.removeEventListener('mousemove', handleMouseMove);

    const { active } = dragState;

    setState(({ topics, ...remainingState }) => ({
      ...remainingState,
      topics: {
        ...topics,
        [active]: {
          ...topics[active],
          coordinates: getNodeAbsoluteCoordinates(topics[active], { texts, boundaries })
        }
      }
    }));
    setDragState();
  }

  const leftColumn = [];
  const rightColumn = [];

  _forEach(texts, (text) => {
    if (text.column === 'left') {
      leftColumn.push(text);
    } else {
      rightColumn.push(text);
    }
  });

  // console.log({ texts, topics, edges, dragState, leftColumn, rightColumn });

  const activeNode = (dragState && dragState.active) || hoveredNode;

  return (
    <div
      className={classnames('root')}
      ref={rootRef}
    >
      <svg
        className={classnames('svg')}
        xmlns='http://www.w3.org/2000/svg'
      >
        <g
          transform={`translate(${SVG_MARGIN}, ${SVG_MARGIN})`}
        >
          {_map(edges, ({ id, source, destination }) => (
            <Edge
              key={id}
              active={source === activeNode || destination === activeNode}
              source={texts[source]}
              destination={topics[destination]}
              activeStroke={topicFillColor}
            />
          ))}
          {_map(topics, (topic) => (
            <Node
              key={topic.title}
              id={topic.title}
              title={topic.title}
              x={topic.coordinates.x}
              y={topic.coordinates.y}
              r={topic.score}
              stroke={topicStrokeColor}
              fill={topicFillColor}
              onMouseEnter={() => setHoveredNode(topic.title)}
              onMouseLeave={() => setHoveredNode()}
              onMouseDown={handletopicMouseDown}
            />
          ))}
        </g>
        {/* Place the Columns after the edges, to have them underneath (mimic z-index) */}
        <Column
          ref={leftColumnRef}
          nodes={leftColumn}
          nodeStroke={sourceTextStrokeColor}
          nodeFill={sourceTextFillColor}
          width={leftColumnWidth}
          onNodeMouseEnter={(title) => setHoveredNode(title)}
          onNodeMouseLeave={() => setHoveredNode()}
        />
        <Column
          ref={rightColumnRef}
          nodes={rightColumn}
          nodeStroke={sourceTextStrokeColor}
          nodeFill={sourceTextFillColor}
          x={width}
          width={rightColumnWidth}
          isRight
          onNodeMouseEnter={(title) => setHoveredNode(title)}
          onNodeMouseLeave={() => setHoveredNode()}
        />
      </svg>
    </div>
  );
}

Relations.displayName = 'Relations force directed chart';

Relations.propTypesSchema = {
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
          description: 'The column to use to display the text',
          type       : 'string',
          source     : 'column'
        },
        value: {
          description: 'A column to use to display in the topic',
          type       : 'string',
          source     : 'column'
        }
      }
    },
    sourceTextStrokeColor: {
      description: 'The border color for the source text nodes',
      type       : 'string',
      source     : 'colorPicker'
    },
    sourceTextFillColor: {
      description: 'The filling color for the source text nodes',
      type       : 'string',
      source     : 'colorPicker'
    },
    topicStrokeColor: {
      description: 'The border color for the topic nodes',
      type       : 'string',
      source     : 'colorPicker'
    },
    topicFillColor: {
      description: 'The filling color for the topic nodes',
      type       : 'string',
      source     : 'colorPicker'
    }
  }
};

Relations.propTypes = propTypeSchema(Relations.propTypesSchema);

Relations.defaultProps = {
  sourceTextStrokeColor: colorPalette.getColor('black'),
  sourceTextFillColor  : colorPalette.getColor('indigo'),
  topicStrokeColor     : colorPalette.getColor('black'),
  topicFillColor       : colorPalette.getColor('deepOrange')
};

// export the default
Relations.defaultData = defaultData;

Relations.thumbnail = thumbnail;
