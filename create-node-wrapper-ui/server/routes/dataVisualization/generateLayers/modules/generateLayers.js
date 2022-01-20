'use strict';

const _ = require('lodash');
const parseCSV = require('csv-parse');
const splitStreamByLine = require('split');
const transform = require('stream-transform');

const uuidFromSeed = require('../../modules/uuidFromSeed');

module.exports = function(layers) {
  return function(stream, next) {
    const colors = {}; // 1 color per first column
    let nodes = {};
    const edges = [];
    let headers;

    return stream
      // https://www.npmjs.com/package/split#keep-matched-splitter
      .pipe(splitStreamByLine(/(\r?\n)/))
      .on('error', next)
      .pipe(parseCSV({
        skip_empty_lines            : true,
        skip_lines_with_empty_values: true,
        skip_lines_with_error       : true,
        trim                        : true
      }))
      .on('error', next)
      // we have to use stream-transform, because csv-parse returns an array,
      // and the stream API works only with string/buffer
      .pipe(transform(function(data) {
        if (!headers) {
          headers = data;

          return;
        }

        const localNodes = {};
        for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
          const layer = layers[layerIndex];
          // layer: [{ color: 0, columns: [{ column: 0, key: [0] }] }]
          for (const column of layer) {
            // column: { color: 0, columns: [{ column: 0, key: [0] }] }

            for (const field of column.columns) {
              // field: { column: 0, key: [0] }
              const columnValue = Object.values(_.pick(data, field.key)).join('.');

              // if the value is empty, we skip
              // there is potentially a different columns to use
              if (columnValue !== '') {
                // we geenerate a unique key based on the config and the layer
                // in order to deduplicate items across tables
                const key = uuidFromSeed(columnValue + layerIndex);

                // eslint-disable-next-line max-depth
                if (layerIndex === 0 && !_.has(colors, data[0])) {
                  colors[data[0]] = Object.keys(colors).length; // start at 0
                }

                localNodes[key] = {
                  label : data[field.column],
                  layer : layerIndex,
                  column: columnValue,
                  id    : key,
                  color : layerIndex < 2 ? colors[data[0]] : -1
                };

                // generate the data only ones per column
                // eslint-disable-next-line no-continue
                break;
              }
            }

            nodes = _.defaults(nodes, localNodes);
          }
        }

        // // eslint-disable-next-line max-depth
        // if (!_.has(colors, data[0])) {
        //   colors[data[0]] = Object.keys(colors).length; // start at 0
        // }

        // now that we have the nodes of the row, we create the edges
        // the edges are created from the keys
        const localEdges = [];

        // eslint-disable-next-line guard-for-in
        for (const key in localNodes) {
          const node = localNodes[key];
          // eslint-disable-next-line guard-for-in
          for (const otherKey in localNodes) {
            const otherNode = localNodes[otherKey];

            // an edge links a node in layer n to a node in layer n+1
            // eslint-disable-next-line max-depth
            if (otherNode.layer === node.layer + 1) {
              // localEdges.push({
              //   color: colors[data[0]],
              //   keys : [key, otherKey]
              // });
              localEdges.push([key, otherKey]);
            }
          }
        }

        edges.push(...localEdges);
      }))
      .on('error', next)
      .on('finish', function() {
        // eslint-disable-next-line no-invalid-this
        this.emit('layers', {
          nodes: Object.values(nodes),
          edges
        });
      });
  };
};
