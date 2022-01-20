/* eslint-disable max-len */
/* eslint-disable no-multi-spaces */
import getFields from '../../../../../DataVisualization/utils/getFields';

// Helping function to flatten fields
const flattenFields = (files) => {
  const fields = [];
  Object.keys(files).forEach((id, index) => {
    fields.push(...getFields(files[id]).map(field => ({
      name     : field.name,
      fileIndex: index,
      fileId   : id,
      type     : field.type
    })));
  });

  return fields;
};

/**
 * Creates the appropriate dataSet for the StructureGraph
 *
 * @function  createDataset
 * @param     files             Object of files with fields on each file
 * @param     relations         Array of relations of fields
 * @param     width             width of SVG element
 * @param     height            height of SVG element
 * @param     ellipse           Boolean if we prefer ellipse
 * @return    {Action}
 */
// eslint-disable-next-line import/prefer-default-export
export const createDataset = (files, relations, width, height, ellipse) => {
  const fields = flattenFields(files);
  const center = { x: width / 2, y: height / 2 };
  const r      = (width > height ? height : width) / 2 - 150;
  const step   = 2 * Math.PI / fields.length;
  const coeff  = ellipse ? height / width : 1;

  const nodes = fields.map((field, index) => ({
    transformations: {
      x          : center.x + r * Math.cos(step * index),
      y          : center.y + coeff * r * Math.sin(step * index),
      rotate     : Math.cos(step * index) > 0 ? step * index / (Math.PI / 180) : (Math.PI + step * index) / (Math.PI / 180),
      orientation: Math.cos(step * index) > 0 ? 'right' : 'left'
    },
    content: {
      label      : field.name,
      color      : field.fileIndex,
      fileId     : field.fileId,
      radius     : 5,
      status     : 'loaded',
      description: `file id:${field.fileId}, type:${field.type}`
    }
  }));

  const links = relations.map(relationPair => ([
    nodes.filter(node => node.content.fileId === relationPair[0].fileId && node.content.label === relationPair[0].field)[0],
    nodes.filter(node => node.content.fileId === relationPair[1].fileId && node.content.label === relationPair[1].field)[0]
  ]));

  return {
    nodes,
    links
  };
};
