/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable camelcase */
import downloadFile from '../../../../../utils/downloadFile';

import data from './demoData';

const LABELS = ['Material Type', 'Cost SubType', 'Supplier'];

export default () => {
  const edges = [];
  const nodes = [];
  data.forEach((row) => {
    const { material_type, cost_subtype, item_supplier, count } = row;
    // creating edges
    const times = Math.ceil(count / 10000);
    for (let i = 0; i < times; i++) {
      edges.push([material_type, cost_subtype]);
      edges.push([cost_subtype, item_supplier]);
    }

    // creating nodes
    ['material_type', 'cost_subtype', 'item_supplier'].forEach((attr, index) => {
      if (nodes.findIndex(({ label }) => label === row[attr]) === -1) {
        nodes.push({
          label: row[attr],
          layer: 3 - index,
          id   : row[attr],
          color: 3 - index,
          modal: [{ label: LABELS[index], value: row[attr] }, { label: 'Count', value: count }]
        });
      }
    });
  });
  const layers = { layers: { edges, nodes } };
  downloadFile({ data: JSON.stringify(layers, null, 4) }, 'demoData.json');
};

// {
//   "label": "GP_SD_COST_CENTER_CODE",
//   "layer": 1,
//   "column": "Process Data.GP_SD_COST_CENTER_CODE",
//   "id": "122d415d-6abc-5aa9-898a-8dcaa506f7a6",
//   "color": 3
// }
