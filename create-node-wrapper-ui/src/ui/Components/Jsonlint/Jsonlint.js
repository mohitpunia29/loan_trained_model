import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { times as _times } from 'lodash';
import bindClassnames from 'classnames/bind';

import { Button } from '@material-ui/core';

import styles from './Jsonlint.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Jsonlint({
  defaultData: initialData, onDataChange,
  classes, resize, fontSize, lineHeight
}) {
  const [data, setData] = useState(formatData(initialData));
  const [defaultData] = useState(initialData);
  const [height, setHeight] = useState();
  const [errorPosition, setErrorPosition] = useState(null);

  useEffect(() => {
    if (onDataChange) {
      try {
        const newData = JSON.parse(data);

        onDataChange(newData);
      } catch (e) {
        console.log('Invalid data, not updating');
      }
    }
  }, [data]);

  useEffect(() => {
    setHeight(lineHeight * data.split('\n').length);
  }, [data, lineHeight]);

  function reset() {
    setData(formatData(defaultData));
    setErrorPosition(null);
  }

  function handleChange(event) {
    const { value } = event.target;

    try {
      JSON.parse(value);
      setErrorPosition(null);
    } catch (e) {
      setErrorPosition(getErrorPosition(e));
      console.log(e);
    }

    setData(value);
  }

  return (
    <div
      className={`${classnames('root')} ${classes.root}`}
    >
      <main className={classnames('main')}>
        <div
          className={classnames('container')}
          style={{
            fontSize  : `${fontSize}px`,
            lineHeight: `${lineHeight}px`
          }}
        >
          <textarea
            className={`${classnames('textarea', { resize })} ${classes.textarea}`}
            style={{ height }}
            value={data}
            onChange={handleChange}
          />
          {errorPosition !== null && (
            <ErrorMarker
              data={data}
              errorPosition={errorPosition}
              lineHeight={lineHeight}
            />
          )}
        </div>
      </main>
      {defaultData && (
        <footer className={`${classnames('footer')} ${classes.footer}`}>
          <Button
            color='secondary'
            onClick={reset}
          >
            Reset
          </Button>
        </footer>
      )}
    </div>
  );
}

Jsonlint.propTypes = {
  onDataChange: PropTypes.func,
  defaultData : PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  classes     : PropTypes.shape({
    root    : PropTypes.string,
    textarea: PropTypes.string,
    footer  : PropTypes.string
  }),
  resize    : PropTypes.bool,
  fontSize  : PropTypes.number,
  lineHeight: PropTypes.number
};

Jsonlint.defaultProps = {
  onDataChange: undefined,
  defaultData : {},
  classes     : {},
  resize      : false,
  fontSize    : 14,
  lineHeight  : 26
};

function formatData(data) {
  return JSON.stringify(data, false, 2);
}

const POSITION_REGEX = /position\s([0-9]+)/;
function getErrorPosition(error) {
  try {
    return parseInt(error.message.match(POSITION_REGEX)[1], 10);
  } catch (e) {
    // in case we get an unexpected error
    return 0;
  }
}

function ErrorMarker({ data, errorPosition, lineHeight }) {
  const dataToError = data.slice(0, errorPosition);
  const rows = dataToError.split('\n');
  if (/^\s+$/.test(rows[rows.length - 1])) {
    rows.pop();
  }

  const offsetTop = rows.length;
  const offsetLeft = rows[rows.length - 1].length;
  const leadingSpace = _times(offsetLeft, () => '_').join('');

  return (
    <>
      <div
        className={classnames('highlight')}
        style={{
          height: lineHeight,
          top   : `${lineHeight * (offsetTop - 1)}px`
        }}
      />
      <p
        className={classnames('marker')}
        style={{
          top: `${lineHeight * (offsetTop)}px`
        }}
      >
        <span className={classnames('invisible')}>
          {leadingSpace}
        </span>
        <span>
          {'^ invalid syntax'}
        </span>
      </p>
    </>
  );
}

ErrorMarker.propTypes = {
  data         : PropTypes.string.isRequired,
  errorPosition: PropTypes.number.isRequired,
  lineHeight   : PropTypes.number.isRequired
};
