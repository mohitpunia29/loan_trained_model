import React from 'react';
import PropTypes from 'prop-types';
import { map as _map } from 'lodash';
import bindClassnames from 'classnames/bind';

import { Typography } from '@material-ui/core';

import FileInfo from '../FileInfo/FileInfo';
import Trash from '../Icons/Trash';

import styles from './DisplayDroppedFiles.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function DisplayDroppedFiles({ files, onDeleteFile }) {
  function handleDeleteFile(e, index) {
    e.stopPropagation();
    onDeleteFile(index);
  }

  let content;

  if (files.length === 0) {
    content = (
      <Typography component='p' variant='subtitle2' gutterBottom>
          No files dropped
      </Typography>
    );
  } else {
    content = (
      <div className={classnames('fileInfo')}>
        <Typography variant='subtitle2' component='h2' gutterBottom>
          Dropped file
          {files.length > 1 ? 's' : null}
        </Typography>
        <div className={classnames('multipleFiles')}>
          {_map(files, (file, index) => (
            <div key={index} className={classnames('row')}>
              <div className={classnames('number')}>
                {index + 1}
                .
              </div>
              <div className={classnames('file')}>
                <FileInfo file={file} dropped />
              </div>
              <div className={classnames('deleteBtn')}>
                <Trash onClick={(e) => handleDeleteFile(e, index)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={classnames('root')}>
      {content}
    </div>
  );
};

DisplayDroppedFiles.propTypes = {
  files       : PropTypes.array.isRequired,
  onDeleteFile: PropTypes.func.isRequired
};
