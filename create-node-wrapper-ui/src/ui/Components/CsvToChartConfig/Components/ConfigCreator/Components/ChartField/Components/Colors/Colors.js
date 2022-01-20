import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  flatten as _flatten,
  map as _map,
  isArray as _isArray,
  isUndefined as _isUndefined
} from 'lodash';
import bindClassnames from 'classnames/bind';

import {
  List,
  ListItem,
  ListItemText,
  RootRef
  // Typography
} from '@material-ui/core';
import { TwitterPicker } from 'react-color';

import * as palettes from '../../../../../../../../constants/colorPalettes';
import useClickOutside from '../../../../../../../../Hooks/useClickOutside';

import styles from './Colors.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const defaultPalette = palettes.basic.get();

export default function Colors({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(_map(() => false));
  const [listContainerRef] = useClickOutside(() => setShowPicker(_map(() => false)));

  useEffect(() => {
    for (let i = 0; i < value.length; i++) {
      if (_isUndefined(value[i])) {
        onChange(defaultPalette[i], i);
      }
    }
  }, [value.length]);

  if (!_isArray(value)) {
    // eslint-disable-next-line no-param-reassign
    value = [value];
  }

  function handleChange(color, index) {
    onChange(color.hex, index);
  }

  function handleOpenPicker(index) {
    const newShowPicker = _map(() => false);
    newShowPicker[index] = true;

    setShowPicker(newShowPicker);
  }

  return (
    <RootRef rootRef={listContainerRef}>
      <List
        dense
        disablePadding
      >
        {_map(value, (color, index) => (
          <ListItem
            key={color + index}
            classes={{ root: classnames('colorContainer') }}
          >
            <ListItemText
              classes={{ root: classnames('color') }}
              style={{ backgroundColor: color }}
              onClick={() => handleOpenPicker(index)}
            />
            {showPicker[index] && (
              <ColorPalettes
                color={color}
                onChange={(newColor => handleChange(newColor, index))}
              />
            )}
          </ListItem>
        ))}
      </List>
    </RootRef>
  );
}

Colors.propTypes = {
  value   : PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func.isRequired
};

Colors.defaultProps = {
  value: []
};

function ColorPalettes({ color, onChange }) {
  const colors = _flatten(_map(palettes, (palette) => palette.get()));

  return (
    <TwitterPicker
      className={classnames('picker')}
      colors={colors}
      color={color}
      onChange={newColor => onChange(newColor)}
    />
  );
}

// function ColorPalettes({ color, onChange }) {
//   return (
//     <div className={classnames('colorPalettes')}>
//       {_map(palettes, (palette, name) => (
//         <div
//           key={name}
//           className={classnames('colorPalette')}
//         >
//           <Typography
//             variant='h6'
//           >
//             {name}
//           </Typography>
//           <TwitterPicker
//             className={classnames('picker')}
//             colors={palette.get()}
//             color={color}
//             onChange={newColor => onChange(newColor)}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
