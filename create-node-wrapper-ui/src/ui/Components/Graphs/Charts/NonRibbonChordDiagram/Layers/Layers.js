/* eslint-disable react/no-array-index-key */
/* eslint-disable radix, react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import { isEmpty as _isEmpty } from 'lodash';

import { OFFSET } from './SvgElements/constants';
import { createDataset } from './transformations';

import Node from './SvgElements/Node';
import Link from './SvgElements/Link';
import useRefDimensions from '../../../../../Hooks/useRefDimensions';

import demoTransformations from './demoTransformations';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './Layers.module.css';

// demoTransformations();

export default function Layers({ layers: { nodes, edges }, showLabels, showLinks }) {
  const [active, setActive] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isManuallyRotating, setIsManuallyRotating] = useState(false);
  const rootRef = useRef(null);
  const [{ width, height }] = useRefDimensions(rootRef, { width: 1200, height: 1200 });
  const xRef = useRef();
  const yRef = useRef();

  useEffect(() => {
    if (isManuallyRotating) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isManuallyRotating]);

  // set modal info for active node
  function getModalInfo(activeNode) {
    if (!activeNode) {
      return {
        show: false
      };
    }

    return {
      show      : true,
      x         : parseInt(activeNode.transformations.x),
      y         : parseInt(activeNode.transformations.y) + parseInt(activeNode.content.radius) / 2,
      center    : activeNode.transformations.center,
      modalPairs: activeNode.content.modalPairs,
      text      : activeNode.content.description
    };
  }

  function handleMouseClick(e, isDown) {
    xRef.current = e.pageX;
    yRef.current = e.pageY;
    setIsManuallyRotating(isDown);
  }

  function handleMouseMove(e) {
    const xDiff = xRef.current - e.pageX;
    const yDiff = yRef.current - e.pageY;

    const calculateOffsetY = (prevOffsetY, _yDiff) => {
      const proposedOffsetY = prevOffsetY + _yDiff / OFFSET.STEPPING.y;
      const minCOEFF = OFFSET.COEFF.base - OFFSET.COEFF.min;
      const maxCOEFF = OFFSET.COEFF.base - OFFSET.COEFF.max;
      // eslint-disable-next-line no-nested-ternary
      return proposedOffsetY > maxCOEFF ? proposedOffsetY < minCOEFF ? proposedOffsetY : minCOEFF : maxCOEFF;
    };

    setOffsetX((prevState) => prevState + xDiff / OFFSET.STEPPING.x);
    setOffsetY((prevState) => calculateOffsetY(prevState, yDiff));
  }

  // finds if a node is linked with an active node
  function isEdgedNode(node, _active, _edges) {
    if (!active) return;

    const nodeEdges = _edges
      .filter((pair) => pair[0] === node.content.id || pair[1] === node.content.id)
      .filter((pair) => pair[0] === _active.content.id || pair[1] === _active.content.id);

    return nodeEdges.length > 0;
  }

  if (_isEmpty(nodes)) return null;

  const dataSet = createDataset(nodes, edges, width, height, offsetX, offsetY);
  const modalInfo = getModalInfo(active);

  return (
    <div
      className={styles.root}
      ref={rootRef}
      style={{ transform: `scale(${height > 550 ? 1 : 0.7})` }}
    >
      {
        modalInfo.show && (
          <div
            className={styles[modalInfo.y > modalInfo.center.y ? 'arrow_box_up' : 'arrow_box_bottom']}
            style={{
              top       : `${modalInfo.y}px`,
              marginLeft: `${modalInfo.x}px`
            }}
          >
            {modalInfo.modalPairs ? modalInfo.modalPairs.map(({ label, value }) => (
              <div className={styles.modalRow}>
                <span>{label}</span>
                <span>{value}</span>
              </div>
            )) : modalInfo.text}
          </div>
        )
      }
      <div style={{ marginTop: height > 550 ? 0 : -80 }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={width}
          height={height < 550 ? 550 : height}
          onMouseDown={(e) => handleMouseClick(e, true)}
          onMouseUp={(e) => handleMouseClick(e, false)}
        >
          {
            // eslint-disable-next-line no-confusing-arrow
            dataSet
              .links
              .filter((link) => !showLinks ? link[0].content.layer === link[1].content.layer : true)
              .map((link, index) => (
                <Link
                  key={index}
                  start={link[0]}
                  finish={link[1]}
                  activeNode={active}
                />
              ))
          }
          {
            dataSet.nodes.map((node, index) => (
              <Node
                key={index}
                content={node.content}
                transformations={node.transformations}
                showLabels={isEdgedNode(node, active, edges) || showLabels}
                actions={{
                  onClick: () => {},
                  onHover: () => setActive(node),
                  onLeave: () => setActive(null)
                }}
              />
            ))
          }
        </svg>
      </div>
    </div>
  );
}

Layers.displayName = 'Helix chart';

Layers.propTypesSchema = {
  type      : 'object',
  required  : ['layers'],
  properties: {
    layers: {
      description: 'Layers object',
      type       : 'object',
      properties : {
        nodes: {
          descriptions: 'Array of nodes',
          type        : 'array',
          items       : {
            type      : 'object',
            properties: {
              content: {
                description: 'Value to display on the node',
                type       : 'string'
              }
            }
          }
        },
        edges: {
          descriptions: 'Array of edges',
          type        : 'array',
          items       : {
            type    : 'array',
            minItems: 2,
            maxItems: 2,
            items   : {
              description: 'id of the node',
              type       : 'string'
            }
          }
        }
      }
    },
    showLabels: {
      displayName: 'labels',
      description: 'Show the labels',
      type       : 'boolean'
    },
    showLinks: {
      displayName: 'links',
      description: 'Show the links',
      type       : 'boolean'
    }
  }
};

Layers.propTypes = propTypeSchema(Layers.propTypesSchema);

Layers.defaultProps = {
  showLabels: false,
  showLinks : true,
  layers    : {}
};

// export the default
Layers.defaultData = defaultData;

Layers.thumbnail = thumbnail;
