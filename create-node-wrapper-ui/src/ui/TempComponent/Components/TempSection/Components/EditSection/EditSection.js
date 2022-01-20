/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-spacing */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Input, Tooltip, Typography } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { isEmpty as _isEmpty } from 'lodash';

import Accordion from '../../../../../Components/Accordion/Accordion';

import styles from './EditSection.module.css';

export default function EditSection({ title, attributes, expanded, uploadState, cleanState }) {
  const [changed, setChanged] = useState({});
  // console.log(`${title}`, attributes);
  // if (!_isEmpty(changed)) console.log('changed', changed);

  const sortedAttributes = attributes.sort((
    { 'x-uiOrder': aUiOrder, key: aKey, group: aGroup },
    { 'x-uiOrder': bUiOrder, key: bKey, group: bGroup }
  ) => {
    if (_isEmpty(changed)) return aUiOrder - bUiOrder;
    // This is the case that uiOrdering has been altered by the user.
    // We need to sort based on changed state instead of old uiOrder attr (if applicable)
    const leftComparison = (changed[`${aGroup}.${aKey}`] && changed[`${aGroup}.${aKey}`]['x-uiOrder']) || aUiOrder;
    const rightComparison = (changed[`${bGroup}.${bKey}`] && changed[`${bGroup}.${bKey}`]['x-uiOrder']) || bUiOrder;
    return leftComparison - rightComparison;
  });

  const handleChange = (key, attr) => (e) => {
    const { value } = e.target;
    setChanged((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [attr]: value
      }
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const source = result.source.index;
    const destination = result.destination.index;
    if (destination === source) return;
    // console.log(`SORTED ${title}`, sortedAttributes);
    if (destination === 0 && ['destinationOffsets', 'styleOffsets'].includes(sortedAttributes[0].key)) return;
    const changedAttributes = {};

    // This is where the magic or ReOrdering happens
    // Elements start at 1. This also normalizes old uiOrder values which were not decimal
    sortedAttributes.forEach(({ 'x-uiOrder': xOrder, key, group }, index) => {
      if (index === source) changedAttributes[`${group}.${key}`] = destination + 1;
      if (destination > source) {
        if (index < source || index > destination) changedAttributes[`${group}.${key}`] = index + 1;
        if (index > source && index <= destination) changedAttributes[`${group}.${key}`] = index;
      }
      if (destination < source) {
        if (index < destination || index > source) changedAttributes[`${group}.${key}`] = index + 1;
        if (index >= destination && index < source) changedAttributes[`${group}.${key}`] = index + 2;
      }
    });

    // console.log('changedAttributes', Object.keys(changedAttributes)
    //   .map((key) => ({ key, uiOrder: changedAttributes[key] }))
    //   .sort((a, b) => a.uiOrder - b.uiOrder));

    setChanged((prev) => {
      const newState = { ...prev };
      Object.keys(changedAttributes).forEach((key) => {
        newState[key] = {
          ...prev[key],
          'x-uiOrder': changedAttributes[key]
        };
      });
      return newState;
    });
  };

  useEffect(() => {
    console.log('cleanState', cleanState);
    if (cleanState > 0) {
      setChanged({});
    }
  }, [cleanState]);

  useEffect(() => {
    uploadState(changed);
  }, [changed]);

  return (
    <div className={styles.root}>
      <Accordion title={title.toUpperCase()} thin black expanded={expanded}>
        <div className={styles.flexColumn}>
          <div className={styles.headerRow}>
            <h4 className={styles.headerField}>Centric Sync Field Name</h4>
            <h4 className={styles.headerField}>Display Name</h4>
            <h4 className={styles.headerField}>Description (Tooltip)</h4>
          </div>
          {attributes.length && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='list'>
                {(dropProvided) => (
                  <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                    {sortedAttributes
                      .map(({
                        title: _title, key, group, 'x-hover': hover, description, 'x-syncField': syncField,
                        'x-syncRefField': xSyncRefField, 'x-uiOrder': xUiOrder
                      }, _index) => (
                        <Draggable
                          key={`row-${title}-${title}-${_index}`}
                          draggableId={`item-${_index}`}
                          index={_index}
                          isDragDisabled={['destinationOffsets', 'styleOffsets'].includes(key)}
                        >
                          {(dragProvided) => (
                            <div
                              className={styles.row}
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                            >
                              <DragIndicatorIcon
                                style={{
                                  marginTop: 6,
                                  color    : ['destinationOffsets', 'styleOffsets'].includes(key) ? 'white' : 'gray' }}
                                fontSize='small'
                              />
                              <Typography variant='body1' classes={{ root: styles.syncField }}>
                                {xSyncRefField || syncField || 'N/A'}
                              </Typography>
                              <Tooltip
                                title={description}
                                placement='top-start'
                                classes={{ tooltip: styles.tooltip }}
                                disableHoverListener
                                disableFocusListener
                              >
                                <Input
                                  id={`textfield-${title}-${key}-${_index}`}
                                  key={`textfield-${title}-${key}-${_index}-${cleanState}`}
                                  defaultValue={_title}
                                  disableUnderline
                                  inputProps={{ maxLength: 250 }}
                                  onChange={handleChange(`${group}.${key}`, 'title')}
                                  classes={{ root: styles.inputField, focused: styles.inputFieldFocused }}
                                />
                              </Tooltip>
                              <Tooltip
                                title={`Hover text`}
                                placement='top-start'
                                classes={{ tooltip: styles.tooltip }}
                                disableHoverListener
                                disableFocusListener
                              >
                                <Input
                                  id={`textfield2-${hover}-${key}-${_index}`}
                                  key={`textfield2-${hover}-${key}-${_index}-${cleanState}`}
                                  defaultValue={hover}
                                  disableUnderline
                                  inputProps={{ maxLength: 250 }}
                                  onChange={handleChange(`${group}.${key}`, 'x-hover')}
                                  classes={{ root: styles.inputField2, focused: styles.inputFieldFocused }}
                                />
                              </Tooltip>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </Accordion>
    </div>
  );
}

EditSection.propTypes = {
  title      : PropTypes.string.isRequired,
  attributes : PropTypes.array,
  expanded   : PropTypes.bool.isRequired,
  uploadState: PropTypes.func.isRequired,
  cleanState : PropTypes.number
};

EditSection.defaultProps = {
  attributes: [],
  cleanState: 0
};
