import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import { useDrag } from 'react-dnd';

import { Button, Typography } from '@material-ui/core';

import dragAndDropTypes from '../../../../constants/dragAndDropTypes';

import style from '../../../../../../config/style';

import styles from './CsvColumn.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function CsvColumn({ name, onDelete }) {
  const [collectedProps, drag] = useDrag({
    item: {
      type: dragAndDropTypes.CSV_COLUMN,
      data: name
    }
  });

  return (
    <div
      className={classnames('root')}
      ref={drag}
      style={{ backgroundColor: style.palette.primary.main }}
    >
      <Typography
        variant='h6'
        classes={{ root: classnames('name') }}
      >
        {name}
      </Typography>
      {onDelete && (
        <Button
          onClick={onDelete}
        >
          x
        </Button>
      )}
    </div>
  );
}

CsvColumn.propTypes = {
  name    : PropTypes.string.isRequired,
  onDelete: PropTypes.func
};

CsvColumn.defaultProps = {
  onDelete: undefined
};
