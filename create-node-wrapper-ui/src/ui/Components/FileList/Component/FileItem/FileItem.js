import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import HoverActions from './HoverActions/HoverActions';

import { formatSize } from '../../../../utils/file';
import { getThumbnailUrl } from '../../../../utils/vault';

import styles from './FileItem.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function FileItem({
  file, sessionId,
  actions, onDeleteFile
}) {
  function handleDeleteFile(e, id) {
    e.stopPropagation();
    onDeleteFile(id);
  }

  return (
    <div className={classnames('root')}>
      <div className={classnames('container')}>
        <img
          className={classnames('thumbnail')}
          src={getThumbnailUrl(file, sessionId)}
          alt={file.name}
        />
        <span
          className={classnames('filename')}
        >
          {file.name}
        </span>
        <span className={classnames('size')}>
          {formatSize(file.size)}
        </span>
      </div>
      <div className={classnames('hoverActions')}>
        <HoverActions
          file={file}
          sessionId={sessionId}
          deleteFile={e => handleDeleteFile(e, file.id)}
          actions={actions}
        />
      </div>
    </div>
  );
}

FileItem.propTypes = {
  file        : PropTypes.object.isRequired,
  sessionId   : PropTypes.string.isRequired,
  actions     : PropTypes.array,
  onDeleteFile: PropTypes.func.isRequired
};

FileItem.defaultProps = {
  actions: undefined
};
