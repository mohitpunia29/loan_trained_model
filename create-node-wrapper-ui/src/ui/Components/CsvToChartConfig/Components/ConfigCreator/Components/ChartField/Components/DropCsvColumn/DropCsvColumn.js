import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';
import {
  map as _map,
  isArray as _isArray
} from 'lodash';
import { useDrop } from 'react-dnd';

import CsvColumn from '../../../CsvColumn/CsvColumn';

import dragAndDropTypes from '../../../../../../constants/dragAndDropTypes';

import styles from './DropCsvColumn.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function DropCsvColumn({ value, multiple, onDrop, onDelete }) {
  console.log({ multiple, value });
  const [collectedProps, drop] = useDrop({
    accept: [dragAndDropTypes.CSV_COLUMN],
    drop  : (item, monitor) => {
      onDrop(item.data);
    },
    collect: monitor => ({
      hovered: monitor.isOver()
    }),
    options: { multiple }
  });

  if (!_isArray(value)) {
    // eslint-disable-next-line no-param-reassign
    value = [value];
  }

  return (
    <div>
      {_map(value, (csvColumn, index) => (
        <div
          key={csvColumn}
          className={classnames('csvColumn')}
        >
          <CsvColumn
            name={csvColumn}
            onDelete={() => onDelete(index)}
          />
        </div>
      ))}
      {(value.length === 0 || multiple) && (
        <div
          className={classnames('dropzone', {
            hovered: collectedProps.hovered
          })}
          ref={drop}
        />
      )}
    </div>
  );
}

DropCsvColumn.propTypes = {
  value   : PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  multiple: PropTypes.bool.isRequired,
  onDrop  : PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

DropCsvColumn.defaultProps = {
  value: []
};
