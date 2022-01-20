import { colors } from '@material-ui/core';

import { get as getConfig } from '../config/core';

const colorPalette = getConfig('modules.common.colorPalette');

class Palette {
  // eslint-disable-next-line no-shadow
  constructor(colors) {
    this.colors = colors;
  }

  get() {
    return Object.values(this.colors);
  }

  getContrast() {
    // eslint-disable-next-line no-shadow
    const colors = Object.values(this.colors);
    colors.pop(); // pop to remove the last background color
    const contrastColors = [];
    for (let i = 0; i < colors.length / 2; i++) {
      contrastColors.push(colors[i]);
      if (i !== colors.length - 1 - i) {
        contrastColors.push(colors[colors.length - 1 - i]);
      }
    }
    return contrastColors;
  }

  getColor(color) {
    return this.colors[color];
  }
}

const palettes = {};

const MATERIAL_UI_COLOR_SHADE = 500;

export const basic = new Palette({
  pink      : colors.pink[MATERIAL_UI_COLOR_SHADE],
  blue      : colors.blue[MATERIAL_UI_COLOR_SHADE],
  cyan      : colors.cyan[MATERIAL_UI_COLOR_SHADE],
  amber     : colors.amber[MATERIAL_UI_COLOR_SHADE],
  deepPurple: colors.deepPurple[MATERIAL_UI_COLOR_SHADE],
  orange    : colors.orange[MATERIAL_UI_COLOR_SHADE],
  yellow    : colors.yellow[MATERIAL_UI_COLOR_SHADE],
  green     : colors.green[MATERIAL_UI_COLOR_SHADE],
  brown     : colors.brown[MATERIAL_UI_COLOR_SHADE],
  purple    : colors.purple[MATERIAL_UI_COLOR_SHADE],
  red       : colors.red[MATERIAL_UI_COLOR_SHADE],
  lightBlue : colors.lightBlue[MATERIAL_UI_COLOR_SHADE],
  deepOrange: colors.deepOrange[MATERIAL_UI_COLOR_SHADE],
  lime      : colors.lime[MATERIAL_UI_COLOR_SHADE],
  indigo    : colors.indigo[MATERIAL_UI_COLOR_SHADE],
  teal      : colors.teal[MATERIAL_UI_COLOR_SHADE],
  grey      : colors.grey[MATERIAL_UI_COLOR_SHADE],
  black     : '#000000',
  blueGrey  : colors.blueGrey[MATERIAL_UI_COLOR_SHADE],
  white     : '#FFFFFF',
  background: '#FFFFFF'
});

// Picking name colours
// http://chir.ag/projects/name-that-color/
export const sunset = new Palette({
  coral        : '#ff7c43',
  tapestry     : '#a05195',
  carnation    : '#f95d6a',
  webOrange    : '#ffa600',
  chambray     : '#2f4b7c',
  butterflyBush: '#665191',
  cranberry    : '#d45087',
  background   : '#513578'
});

// Color Palette Helper
// https://gka.github.io/palettes/#/12|d|2f4b7c,665191,a05195,d45087|f95d6a,ff7c43,ffa600|1|1
export const sunsetEnhanced = new Palette({
  chambray     : '#2f4b7c',
  eastBay      : '#4e4e85',
  butterflyBush: '#6b508b',
  trendyPink   : '#86528f',
  tapestry     : '#a1528f',
  mulberry     : '#bb518d',
  bittersweet  : '#fc6b5c',
  coral        : '#fd774f',
  coral2       : '#fe8442',
  neonCarrot   : '#ff8f33',
  sunshade     : '#ff9b22',
  background   : '#513578'
});

palettes.basic = basic;
palettes.sunset = sunset;
palettes.sunsetEnhanced = sunsetEnhanced;

// export as default the palette from the config, and fallback to the first palette if not set
export default (palettes[colorPalette] || Object.values(palettes)[0]);
