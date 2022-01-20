import React from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import MoreIcon from '../../../../Icons/More';
import DownloadIcon from '../../../../Icons/Download';
import TrashIcon from '../../../../Icons/Trash';
import { getFileUrl } from '../../../../../utils/vault';

import styles from './HoverActions.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function HoverActions({ actions, deleteFile, file, sessionId }) {
  const buttons = [];

  if (actions.indexOf('download') !== -1) {
    buttons.push(
      <a
        key='download'
        className={classnames('file___action')}
        href={getFileUrl({ id: file.id, name: file.name, sessionId })}
        target="_blank"
        rel="noopener noreferrer"
        alt="Download"
        // stopPropagation to prevent the selection of the file (MenuItem onClick)
        onClick={(e) => {e.stopPropagation()}}
      >
        <DownloadIcon />
      </a>
    );
  }

  if (actions.indexOf('delete') !== -1) {
    buttons.push(
      <div
        key='delete'
        className={classnames('file___action')}
        onClick={(e) => {
          e.stopPropagation();
          deleteFile();
        }}
      >
        <TrashIcon/>
      </div>
    );
  }

  return (
    <div className={classnames('root')}>
      <div
        className={classnames('overlay')}
        style={{
          width: 40 * actions.length,
          right: -40 * actions.length
        }}
      >
        {buttons}
      </div>

      <div className={classnames('file___more')}>
        <MoreIcon/>
      </div>
    </div>
  );
}

HoverActions.propTypes = {
  file      : PropTypes.object,
  sessionId : PropTypes.string,
  deleteFile: PropTypes.func,
  actions   : PropTypes.arrayOf(PropTypes.oneOf(['download', 'delete']))
};

HoverActions.defaultProps = {
  actions: ['download', 'delete']
};
