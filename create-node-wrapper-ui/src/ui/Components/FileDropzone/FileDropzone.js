import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty } from 'lodash';
import bindClassnames from 'classnames/bind';

import Button from '@material-ui/core/Button';

import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';
import DescriptionIcon from '@material-ui/icons/Description';

import Dropzone from '../Dropzone/Dropzone';

import styles from './FileDropzone.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function FileDropzone({
  className: additionalClassName, file, header,
  deleteFiles, onFilesDrop, accept, multiple
}) {
  let content;

  let HEADER = null;
  if (header) {
    HEADER = <h4>Upload a file</h4>;
  }

  function handleDeleteFile(e) {
    e.stopPropagation();

    deleteFiles();
  }

  if (!_isEmpty(file)) {
    content = (
      <div>
        <h4>{file.name}</h4>
        <div className={classnames('icon')}>
          <DescriptionIcon fontSize='inherit' />
        </div>
        <Button
          onClick={handleDeleteFile}
          className={classnames('delete')}
        >
          <DeleteIcon fontSize='inherit' />
        </Button>
      </div>
    );
  } else {
    content = (
      <div className={classnames('border')}>
         <h4>{header}</h4>
        <div className={classnames('icon')}>
          <PublishIcon
            className={classnames({ withoutHeader: !HEADER })}
            fontSize='inherit'
          />
        </div>
        <p className={classnames('description')}>
          Drag your file or click to upload manually
        </p>
      </div>
    );
  }

  return (
    <Dropzone
      onFilesDrop={onFilesDrop}
      accept={accept}
      multiple={multiple}
      render={({ rootProps, inputProps, isDragActive }) => (
        <div
          className={classnames('root', additionalClassName, { dropping: isDragActive })}
          {...rootProps}
        >
          {content}
          <input {...inputProps} />
        </div>
      )}
    />
  );
}

FileDropzone.propTypes = {
  onFilesDrop: PropTypes.func.isRequired,
  deleteFiles: PropTypes.func,
  className  : PropTypes.string,
  file       : PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  header     : PropTypes.string,
  multiple   : PropTypes.bool,
  accept     : PropTypes.arrayOf(PropTypes.string)
};

FileDropzone.defaultProps = {
  deleteFiles: () => {},
  file       : {},
  className  : '',
  header     : 'Upload a file',
  multiple   : undefined,
  accept     : undefined
};
