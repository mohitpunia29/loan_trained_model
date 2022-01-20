import React from 'react';
import PropTypes from 'prop-types';
import {
  defaults as _defaults,
  isFunction as _isFunction,
  map as _map,
  pick as _pick
} from 'lodash';
import bindClassnames from 'classnames/bind';

import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

import { getThumbnailUrl } from '../../utils/vault';
import { formatSize } from '../../utils/file';

import styles from './FileInfo.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function FileInfo({ column, file, dropped, fields, additionalFieldsGetters }) {
  let headline;
  if (!dropped) {
    headline = (
      <Typography
        classes={{
          subtitle2: classnames('subtitle2__override')
        }}
        variant='subtitle2'
        align='left'
        component='h4'
      >
        File Selected
      </Typography>
    );
  }

  const info = _pick(file, fields);
  if (info.size) {
    info.size = formatSize(info.size);
  }
  if (_isFunction(additionalFieldsGetters)) {
    _defaults(info, additionalFieldsGetters(file));
  }

  return (
    <div className={classnames('root', {
      vertical: column
    })}>
      <img src={getThumbnailUrl(file)} alt={file.name} />
      <div className={classnames('fileInfo', { row: !column })}>
        {headline}
        <List>
          {_map(info, (value, key) => (
            <ListItem
              key={key}
              dense
              disableGutters
              classes={{ root: classnames('fileInfo___item') }}
            >
              <ListItemText>
                <b>{key}:</b> {value}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}

FileInfo.propTypes = {
  file                   : PropTypes.object.isRequired,
  column                 : PropTypes.bool,
  dropped                : PropTypes.bool,
  fields                 : PropTypes.array,
  additionalFieldsGetters: PropTypes.func
};

FileInfo.defaultProps = {
  column : false,
  dropped: false,
  fields : ['name', 'size']
};
