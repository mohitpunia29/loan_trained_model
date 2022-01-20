/* eslint-disable radix, react/prop-types */
import React, { useState } from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import bindClassnames from 'classnames/bind';

import { createDataset } from './transformations';

import Node from './SvgElements/Node';
import Link from './SvgElements/Link';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

import styles from './Ellipse.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Ellipse({ width, height, ellipse, files, relations }) {
  const [active, setActive] = useState(null);

  if (!files) return null;

  function setModalInfo(activeNode) {
    if (!activeNode) {
      return {
        show: false
      };
    }

    return {
      show: true,
      x   : parseInt(activeNode.transformations.x),
      y   : parseInt(activeNode.transformations.y) + parseInt(activeNode.content.radius) / 2,
      text: activeNode.content.description
    };
  }

  const dataSet = createDataset(files, relations, width, height, ellipse);
  const modalInfo = setModalInfo(active);

  return (
    <div className={classnames('root')}>
      {
        modalInfo.show && (
          <div
            className={classnames(modalInfo.y > height / 2 ? 'arrow_box_up' : 'arrow_box_bottom')}
            style={{
              top       : `${modalInfo.y}px`,
              marginLeft: `${modalInfo.x}px`
            }}
          >
            {modalInfo.text}
          </div>
        )
      }
      <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height}>
        {
          dataSet.links.map((link, index) => (
            <Link
              key={index}
              start={link[0]}
              finish={link[1]}
              activeNode={active}
              center={{ x: width / 2, y: height / 2 }}
            />
          ))
        }
        {
          dataSet.nodes.map((node, index) => (
            <Node
              key={index}
              content={node.content}
              transformations={node.transformations}
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
  );
}

Ellipse.propTypesSchema = {
  type      : 'object',
  required  : ['files', 'relations', 'width', 'height', 'ellipse'],
  properties: {
    files: {
      description: 'File object',
      type       : 'object'
    },
    relations: {
      description: 'Array representing the relations between nodes',
      type       : 'array',
      minItems   : 2,
      maxItems   : 2,
      items      : {
        description: 'Relation object',
        type       : 'object',
        properties : {
          fileId: {
            description: 'Id of the file',
            type       : 'string'
          },
          field: {
            description: 'Name of the field',
            type       : 'string'
          }
        }
      }
    },
    width: {
      description: 'Width of the graph',
      type       : 'number'
    },
    height: {
      description: 'Height of the graph',
      type       : 'number'
    },
    ellipse: {
      description: 'Show the graph as an ellipse',
      type       : 'boolean'
    }
  }
};

Ellipse.propTypes = propTypeSchema(Ellipse.propTypesSchema);

// export the default
Ellipse.defaultData = defaultData;

Ellipse.thumbnail = thumbnail;
