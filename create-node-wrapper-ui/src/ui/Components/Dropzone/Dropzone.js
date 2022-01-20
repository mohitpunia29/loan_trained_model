import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty } from 'lodash';

import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';

import { getFileExtension } from '../../utils/file';

export default function Dropzone({ render, onFilesDrop, accept, noClick, multiple, maxSize }) {
  const { enqueueSnackbar } = useSnackbar();

  const onDrop = useCallback((files) => {
    for (const file of files) {
      window.URL.revokeObjectURL(file.preview);
    }

    onFilesDrop(files);
  }, [onFilesDrop]);

  const onDropRejected = useCallback((files) => {
    // handling error for multiple=false
    if (!multiple && files.length !== 1) {
      return displayErrorMessage(
        'A single file is allowed to upload at a time.'
      );
    }

    for (const file of files) {
      // handling error for accepted file types
      const fileType = getFileExtension(file.name);
      if (!_isEmpty(accept) && !accept.includes(fileType)) {
        return displayErrorMessage('Invalid file type.');
      }
    }
  }, [accept, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    multiple,
    noClick,
    maxSize
  });

  function displayErrorMessage(message) {
    enqueueSnackbar(message, { variant: 'error' });
  }

  return render({
    rootProps : getRootProps(),
    inputProps: getInputProps(),
    isDragActive
  });
}

Dropzone.propTypes = {
  render     : PropTypes.func.isRequired,
  accept     : PropTypes.arrayOf(PropTypes.string),
  onFilesDrop: PropTypes.func.isRequired,
  noClick    : PropTypes.bool,
  multiple   : PropTypes.bool,
  maxSize    : PropTypes.bool
};

Dropzone.defaultProps = {
  accept  : undefined,
  noClick : false,
  multiple: false,
  maxSize : undefined
};
