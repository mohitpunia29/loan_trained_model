import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import Filename from '../Filename/Filename';
import Textarea from '../Textarea/Textarea';
import FileDropzone from '../FileDropzone/FileDropzone';
import DisplayDroppedFiles from '../../DisplayDroppedFiles/DisplayDroppedFiles';

import styles from './GenericInput.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function GenericInput({
  withFilename, filename, filenameExtension, onFilenameChange,
  text, onTextChange, textPlaceholder,
  withDropzone, files, onFilesDrop, onDeleteFile, multipleFiles,
  onErrorChange
}) {
  const [hasFilenameError, setHasFilenameError] = useState(false);
  const [hasTextError, setHasTextError] = useState(false);

  useEffect(() => {
    onErrorChange(hasFilenameError || hasTextError);
  }, [hasFilenameError, hasTextError]);

  function renderFilename() {
    if (!withFilename) return null;
    if (files.length !== 0) return null;

    return (
      <Filename
        filename={filename}
        onChange={onFilenameChange}
        extension={filenameExtension}
        showDefault={Boolean(text)}
        onErrorChange={setHasFilenameError}
      />
    );
  }

  function renderTextarea() {
    if (files.length !== 0) return null;

    return (
      <Textarea
        text={text}
        onChange={onTextChange}
        placeholder={textPlaceholder}
        onErrorChange={setHasTextError}
      />
    );
  }

  function renderDropzone() {
    if (!withDropzone) return null;

    return (
      <>
        <div className={classnames('divider')} />
        <div
          className={classnames('fileDropzone')}
        >
          <FileDropzone
            onFilesDrop={onFilesDrop}
            deleteFiles={onDeleteFile}
            multiple={multipleFiles}
            header='Upload a file'
          />
        </div>
      </>
    );
  }

  function renderDroppedFiles() {
    if (files.length === 0) return null;

    return (
      <DisplayDroppedFiles
        files={files}
        onDeleteFile={onDeleteFile}
      />
    );
  }

  return (
    <div className={classnames('root')}>
      <div className={classnames('container')}>
        {renderFilename()}
        {renderTextarea()}
        {renderDroppedFiles()}
      </div>
      {renderDropzone()}
    </div>
  );
}

GenericInput.propTypes = {
  withFilename     : PropTypes.bool,
  withDropzone     : PropTypes.bool,
  filenameExtension: PropTypes.string,
  onFilenameChange : PropTypes.func,
  filename         : PropTypes.string,
  text             : PropTypes.string.isRequired,
  onTextChange     : PropTypes.func.isRequired,
  textPlaceholder  : PropTypes.string,
  files            : PropTypes.arrayOf(PropTypes.object),
  onFilesDrop      : PropTypes.func,
  onDeleteFile     : PropTypes.func,
  multipleFiles    : PropTypes.bool,
  onErrorChange    : PropTypes.func
};

GenericInput.defaultProps = {
  withFilename     : false,
  filename         : '',
  filenameExtension: '',
  onFilenameChange : undefined,
  textPlaceholder  : 'Insert your text here',
  withDropzone     : false,
  files            : [],
  onFilesDrop      : undefined,
  onDeleteFile     : undefined,
  multipleFiles    : false,
  onErrorChange    : () => {}
};
