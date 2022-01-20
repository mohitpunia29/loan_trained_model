import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  cloneDeep as _cloneDeep,
  isEmpty as _isEmpty,
  keyBy as _keyBy,
  includes as _includes,
  isArray as _isArray,
  map as _map,
  merge as _merge,
  omit as _omit,
  pick as _pick,
  reduce as _reduce,
  uniq as _uniq,
  without as _without
} from 'lodash';
import uuid from 'uuid/v4';

import { useConfigContext } from '../Providers/ConfigProvider/ConfigProvider';

import * as vault from '../utils/vault';
import mergeAiMeta from '../utils/mergeAiMeta';

import { getFileIndex, sortList } from '../utils/sortingHelpers';
import { SORT } from '../constants/sort';

const DEFAULT_PAGINATION = 20;

const INITIAL_FILE_LIST = _reduce(SORT, (result, sortOrder) => {
  // eslint-disable-next-line no-param-reassign
  result[sortOrder] = [];

  return result;
}, {});

export default function useFileCache({ socket, authInfo: { authToken, rootFolderId }, models, pagination, params, defaults = {} }) {
  const configContext = useConfigContext();
  const { enqueueSnackbar } = useSnackbar();
  const { onAuthInfoExpired } = configContext;
  const [fileCache, setFileCache] = useState({});
  const [fileList, setFileList] = useState(_cloneDeep(INITIAL_FILE_LIST)); // { newest: [], oldest: [] }
  const [sort, setSort] = useState(defaults.sort || SORT.newest);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const [fetchingCacheFileIds, setFetchingCacheFileIds] = useState([]);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const count = pagination ? pagination.rowsPerPage : DEFAULT_PAGINATION;

  const socketHandlers = {
    notification: (notification) => {
      // eslint-disable-next-line no-console
      console.log('notification', notification);
      if (notification.namespace === 'fileNotify') {
        if (notification.method === 'AIUpdate') {
          handleAIUpdateNotification(notification);
        } else if (notification.method === 'create') {
          handleNewFileNotification(notification);
        } else if (notification.method === 'delete') {
          handleDeleteFileNotification(notification);
        }
      }
    }
  };

  // list of files for the current sort order
  const filesForSort = _pick(fileCache, fileList[sort]);

  let files;
  if (pagination) {
    // if we're paginating, we select only the range of files we want
    files = _pick(
      filesForSort,
      Object.keys(filesForSort)
        .slice(pagination.page * pagination.rowsPerPage, (pagination.page + 1) * pagination.rowsPerPage)
    );
  } else {
    // if we're using infinite scroll, we want all the files
    files = filesForSort;
  }

  useEffect(() => {
    if (socket) {
      socket.addHandlers(socketHandlers);
    }

    return () => {
      if (socket) {
        socket.removeHandlers(socketHandlers);
      }
    };
  }, [socket, fileList]);

  // componentDidMount, load the files
  useEffect(() => {
    if (_isEmpty(fileList[sort]) && hasMoreItems) {
      loadFiles();
    }
  }, [fileList[sort]]);

  // When we have all the files (!hasMoreItems), then we won't fetch more data from the server
  // instead, we will sort the files locally
  useEffect(() => {
    // if we do not have more items to load
    // and the list is not already correct
    if (!hasMoreItems && Object.keys(fileCache).length !== fileList[sort].length) {
      setFileList(prevState => ({
        ...prevState,
        [sort]: _map(sortList(fileCache, sort), 'id')
      }));
    }
  }, [sort, hasMoreItems]);

  useEffect(() => {
    const filesLength = Object.keys(filesForSort).length;
    if (filesLength > 0 && hasMoreItems && (filesLength <= pagination.rowsPerPage * (pagination.page + 1))) {
      console.log(`Loading ${pagination.rowsPerPage} new Files. Current preload length: ${filesLength}`);
      loadFiles();
    }
  }, [pagination]);

  return [{
    files,
    sort,
    fetchingCacheFileIds,
    isFetchingFiles,
    hasMoreItems,
    isUploading
  }, {
    handleSortChange : setSort,
    handleReachBottom: loadFiles,
    handleUploadFiles: uploadFiles,
    handleUpdateFile : updateFile,
    handleDeleteFile : deleteFile,
    fetchFileCache
  }];

  async function loadFiles() {
    if (!authToken || isFetchingFiles || !hasMoreItems) return;
    setIsFetchingFiles(true);
    const filesAttempt = await vault.getFiles(authToken, {
      ...params,
      sort,
      start: fileList[sort].length,
      count
    });
    setIsFetchingFiles(false);

    if (filesAttempt.success) {
      filesAttempt.data = _map(filesAttempt.data, '0');

      const newFilesToCache = _keyBy(filesAttempt.data, 'id');
      setFileCache(prevState => ({
        // we need to merge because the new files don't have aiMeta
        // and we don't want to lose the field if we have it
        // but we don't mind getting fresher data for the rest
        ..._merge(prevState, newFilesToCache)
      }));

      const newFiles = Object.keys(newFilesToCache);
      setFileList(prevState => ({
        ...prevState,
        [sort]: _uniq([
          ...prevState[sort],
          ...newFiles
        ])
      }));

      if (newFiles.length !== count) {
        setHasMoreItems(false);
      }
    } else if (filesAttempt.data === 401) {
      onAuthInfoExpired();
    }
  }

  function handleDeleteFileNotification(notification) {
    const deletedFileId = notification.body.id;
    // delete the file from the fileCache
    setFileCache((prevState) => {
      delete prevState[deletedFileId];
      return {
        ...prevState
      };
    });
    enqueueSnackbar(`File deleted with id: ${deletedFileId}`);
  }

  function handleNewFileNotification(notification) {
    const newFile = notification.body[0];

    // only keep the files that we care about
    if (params.type && newFile.type !== params.type) return;
    if (params.parentFileDescriptorId && newFile.parentFileDescriptorId !== params.parentFileDescriptorId) return;
    // do not process if we already have it
    if (_includes(fileList[sort], newFile.id)) return;

    if (newFile.aiMeta && newFile.aiMeta.models) {
      newFile.aiMeta.models = _pick(newFile.aiMeta.models, models);
    }

    // either hasMoreItems is false or
    // we are receiving notifications for an empty list
    // the empty list can caused by two situations
    // 1.
    // we have fetched the files, but there are none,
    // this case is not important,because hasMoreItems would be false in this situation
    // 2.
    // we are receiving notifications before we've had time to load the files
    // in which case, we can start populating the files with the notifications
    // when the fetch file request finishes, we'll just dedupe the files
    const noMoreItems = !hasMoreItems || !_isEmpty(filesForSort);

    const indexToInsert = getFileIndex({
      noMoreItems,
      list: Object.values(filesForSort)
    }, newFile, sort);

    // there is no place for our file to insert
    if (indexToInsert < 0) return;

    // do not cache the files for a page we're not one
    if (pagination && indexToInsert > (pagination.page + 1) * pagination.rowsPerPage) {
      console.log('discarding');
      if (hasMoreItems) {
        setHasMoreItems(true);
      }
      return;
    }
    console.log('keeping');

    // add the file to the fileCache
    setFileCache(prevState => ({
      ...prevState,
      [newFile.id]: newFile
    }));
    // add the new file to the list
    setFileList((prevState) => {
      prevState[sort].splice(indexToInsert, 0, newFile.id);

      return {
        ...prevState,
        [sort]: [...prevState[sort]]
      };
    });

    // if the new file is in the list of files that the user uploaded
    // if (_includes(pendingIds, FILE_ID)) {
    //   // remove the file from the list
    //   setPendingIds(_without(pendingIds, FILE_ID));
    //   // automatically select it
    //   setCheckedFileIds([...checkedFileIds, FILE_ID]);
    // }
  }

  function handleAIUpdateNotification(notification) {
    let newModels = notification.body.partialAiMeta.models;
    if (models) {
      newModels = _pick(newModels, models);
    }

    if (_isEmpty(newModels)) return;

    const FILE_ID = notification.body.id;

    if (!fileCache[FILE_ID]) {
      console.log(`AIUpdate Foreign notification: ${Object.keys(newModels)[0]} for id: ${FILE_ID}`);
      return;
    }

    updateFileData(notification);
  }

  function updateFileData(notification) {
    const FILE_ID = notification.body.id;
    const file = fileCache[FILE_ID];

    setFileCache(prevState => ({
      ...prevState,
      [FILE_ID]: {
        ...file,
        aiMeta: mergeAiMeta(file.aiMeta, notification.body.partialAiMeta)
      }
    }));
  }

  async function uploadFiles(filesToUpload) {
    if (!_isArray(filesToUpload)) {
      // eslint-disable-next-line no-param-reassign
      filesToUpload = [filesToUpload];
    }

    const result = {
      success: [],
      failure: []
    };

    for (const file of filesToUpload) {
      const params = {
        id: file.id || uuid(),
        rootFolderId
      };
      if (file.parentFileDescriptorId) {
        params.parentFileDescriptorId = file.parentFileDescriptorId;
        delete file.parentFileDescriptorId;
      }

      setIsUploading(true);
      // eslint-disable-next-line no-await-in-loop
      const createFileAttempt = await vault.createFile(authToken, file, params);
      setIsUploading(false);
      if (createFileAttempt.success) {
        console.log('File uploaded to Vault: ', createFileAttempt.data);
        result.success.push(params.id);
      } else {
        result.failure.push(params.id);
      //   setErrorHandling({
      //     message: `Vault upload error: ${createFileAttempt.data}`
      //   });
      }
    }

    return result;
  }

  async function deleteFile(fileId) {
    const deleteFileAttempt = await vault.deleteFile(authToken, fileId);
    if (deleteFileAttempt.success) {
      setFileList(prevState => (
        _reduce(prevState, (result, list, sortOrder) => {
          // eslint-disable-next-line no-param-reassign
          result[sortOrder] = _without(list, fileId);

          return result;
        }, {})
      ));
      setFileCache(prevState => _omit(prevState, fileId));
    }
  }

  function updateFile(file) {
    setFileCache(prevState => ({
      ...prevState,
      [file.id]: { ...file }
    }));
  }

  async function fetchFileCache(fileId) {
    if (fileCache[fileId].aiMeta) return;

    setFetchingCacheFileIds(prevState => [
      ...prevState,
      fileId
    ]);
    const aiMeta = await vault.getFileAiMeta(authToken, fileId);

    setFetchingCacheFileIds(prevState => _without(prevState, fileId));

    setFileCache((prevState) => {
      const file = {
        ...prevState[fileId],
        aiMeta
      };

      return {
        ...prevState,
        [fileId]: file
      };
    });
  }
}
