import React from 'react';
import PropTypes from 'prop-types';
import {
  forEach as _forEach,
  isEmpty as _isEmpty,
  isFunction as _isFunction,
  includes as _includes,
  map as _map,
  noop as _noop
} from 'lodash';
import moment from 'moment-timezone';
import bindClassnames from 'classnames/bind';

import {
  MenuItem, MenuList,
  FormControl, Select,
  Checkbox
} from '@material-ui/core';

import { SORT } from '../../constants/sort';
import { formatSize } from '../../utils/file';

import FileItem from './Component/FileItem/FileItem';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import Spinner from '../Spinner/Spinner';

import styles from './FileList.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

/**
 * This Component is used to display a list of files
 *
 * It can be used in two ways
 * To select a single file at a time, for this you need to pass those two props:
 *  - selectedFileId
 *  - onSelectFile
 * To select multiple files via check boxes, for this you need to pass those two props:
 *  - checkedFiles
 *  - onCheckedFilesChange
 *
 * You can also customize the actions, @see HoverActions for more details
 * @param {Array}    [checkedFileIds]
 * @param {Function} [onCheckedFilesChange]
 * @param {Function} [onDeleteFile]
 * @param {Array}    [actions]
 */
export default function FileList(props) {
  const {
    sessionId,
    files,
    selectedFileId,
    onSelectFile,
    checkedFileIds,
    onCheckedFilesChange,
    onDeleteFile,
    onSortChange,
    onReachBottom,
    actions,
    requestPending,
    sort,
    FileComponent,
    header,
    classes
  } = props;

  async function handleSortChange(event) {
    onSortChange(event.target.value);
  }

  function handleSelectFile(fileId) {
    if (_isFunction(onSelectFile)) {
      onSelectFile(fileId);
    }
  }

  function renderSortDropdown() {
    if (!sort) return null;
    const { sort: sortClass } = classes;

    return (
      <FormControl classes={{ root: classnames('formControl') }}>
        <Select
          value={sort}
          disableUnderline
          onChange={handleSortChange}
          classes={{ select: sortClass }}
        >
          {_map(SORT, el => (
            <MenuItem key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const WITH_CHECKED_BOX = _isFunction(onCheckedFilesChange);

  function renderInitialLoad() {
    return (
      <div className={classnames('spinnerContainer')}>
        <Spinner />
      </div>
    );
  }

  function renderNoFiles() {
    return (
      <div className={classnames('noFilesContainer')}>
        <p>No files have been uploaded yet</p>
      </div>
    );
  }

  function renderWithFiles() {
    let HEADER = null;
    if (header) {
      HEADER = <h4>{header}</h4>;
    }

    return (
      <>
        <div className={classnames('header')}>
          {HEADER}
          {renderSortDropdown()}
        </div>
        <div
          className={classnames('bucketContainer')}
          // eslint-disable-next-line no-return-assign
          // ref={node => infiniteScrollContainer.current = node}
        >
          {renderList()}
        </div>
      </>
    );
  }

  function renderList() {
    if (!sessionId) return null;

    return (
      <div className={classnames('filesContainer')}>
        <InfiniteScroll
          onReachBottom={onReachBottom}
          isLoading={requestPending}
        >
          {_map(bucketizeFiles(files, sort), (bucketFiles, bucket) => (
            <div
              key={bucket}
              className={classnames('bucket')}
            >
              <time>{bucket}</time>
              {_map(bucketFiles, file => (
                <MenuList
                  className={classnames('list')}
                  key={file.id}
                >
                  <MenuItem
                    selected={selectedFileId === file.id}
                    onClick={() => {
                      handleSelectFile(file.id);
                    }}
                    classes={{ root: classnames('item') }}
                  >
                    <div className={classnames('itemContainer')}>
                      {WITH_CHECKED_BOX && (
                        <div className={classnames('checkboxContainer')}>
                          <CheckBoxComponent
                            file={file}
                            checked={_includes(checkedFileIds, file.id)}
                            onChange={onCheckedFilesChange}
                          />
                        </div>
                      )}
                      <div
                        className={classnames('fileComponent', { withCheckBox: WITH_CHECKED_BOX })}
                      >
                        <FileComponent
                          file={file}
                          sessionId={sessionId}
                          actions={actions}
                          onDeleteFile={onDeleteFile}
                          withCheckBox={WITH_CHECKED_BOX}
                        />
                      </div>
                    </div>
                  </MenuItem>
                </MenuList>
              ))}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );
  }

  let content = null;
  if (_isEmpty(files)) {
    if (requestPending) {
      content = renderInitialLoad();
    } else {
      content = renderNoFiles();
    }
  } else {
    content = renderWithFiles();
  }

  return (
    <div className={classnames('root')}>
      {content}
    </div>
  );
}

FileList.propTypes = {
  sessionId           : PropTypes.string.isRequired,
  files               : PropTypes.object.isRequired,
  onSortChange        : PropTypes.func,
  onReachBottom       : PropTypes.func,
  selectedFileId      : PropTypes.string,
  onSelectFile        : PropTypes.func,
  checkedFileIds      : PropTypes.array,
  onCheckedFilesChange: PropTypes.func,
  onDeleteFile        : PropTypes.func,
  actions             : PropTypes.array,
  sort                : PropTypes.string.isRequired,
  requestPending      : PropTypes.bool,
  FileComponent       : PropTypes.func,
  header              : PropTypes.string,
  classes             : PropTypes.object
};

FileList.defaultProps = {
  selectedFileId      : undefined,
  checkedFileIds      : undefined,
  actions             : undefined,
  onSortChange        : _noop,
  onSelectFile        : _noop,
  onCheckedFilesChange: null,
  onReachBottom       : _noop,
  onDeleteFile        : _noop,
  requestPending      : false,
  FileComponent       : FileItem,
  header              : 'Files',
  classes             : {}
};

function CheckBoxComponent({ file, checked, onChange }) {
  return (
    <Checkbox
      classes={{ root: classnames('checkbox') }}
      file={file}
      checked={checked}
      onChange={(event, isChecked) => onChange(file.id, isChecked)}
    />
  );
}

CheckBoxComponent.propTypes = {
  file    : PropTypes.object.isRequired,
  checked : PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

CheckBoxComponent.defaultProps = {
  checked: false
};

/**
 * Create an object with the buckets as the key and an array of files for each
 *
 * @param  {Array}  files
 * @param  {String} sort
 * @return {Object}
 */
function bucketizeFiles(files, sort) {
  const buckets = {};

  if (!files) return {};

  _forEach(files, (file) => {
    const bucket = sortOrderToBucketFn[sort](file);

    if (!buckets[bucket]) {
      buckets[bucket] = [];
    }

    buckets[bucket].push(file);
  });

  return buckets;
}

const sortOrderToBucketFn = {
  newest  : file => formatDate(file.date),
  oldest  : file => formatDate(file.date),
  'a-z'   : file => getFirstLetter(file.name),
  'z-a'   : file => getFirstLetter(file.name),
  sizeAsc : file => normalizeSize(file.size),
  sizeDesc: file => normalizeSize(file.size)
};

function formatDate(date) {
  const momentDate = moment(date);

  const isToday = momentDate.isSame(moment(), 'day');

  if (isToday) {
    return 'today';
  }

  return momentDate.format('MM/DD/YYYY');
}

function getFirstLetter(fileName) {
  return fileName[0].toUpperCase();
}

function normalizeSize(size) {
  const RANGE = 1024;

  return formatSize(Math.floor(size / RANGE) * RANGE, { decimalPlaces: 0 });
}
