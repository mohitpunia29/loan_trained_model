import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import PublishIcon from '@material-ui/icons/Publish';

import Dropzone from '../../Dropzone/Dropzone';
// Bind to classnames
import styles from './FileDropzone.module.css';

const classnames = bindClassnames.bind(styles);

export default function FileDropzone({ onFilesDrop, accept, multiple, header }) {
  return (
    <Dropzone
      onFilesDrop={onFilesDrop}
      accept={accept}
      multiple={multiple}
      render={({ rootProps, inputProps, isDragActive }) => (
        <div
          className={classnames('root', { dropping: isDragActive })}
          {...rootProps}
        >
          <div className={classnames('border')}>
            <h4>{header}</h4>
            <div className={classnames('icon')}>
              <PublishIcon fontSize='inherit' />
            </div>
            <p className={classnames('description')}>
              Drag your file or click to upload manually
            </p>
          </div>
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
