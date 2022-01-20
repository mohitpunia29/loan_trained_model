const COLOR_REGEX = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;

export default function colorHexToRGB(htmlColor, opacity = 1) {
  const arrRGB = htmlColor.match(COLOR_REGEX);

  if (!arrRGB) return htmlColor;

  return `rgba(${parseInt(arrRGB[1], 16)},${parseInt(arrRGB[2], 16)},${parseInt(arrRGB[3], 16)},${opacity})`;
}
