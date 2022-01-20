export const circlefy = (selector, center, radius, angle, x, y) => {
  // setting wrapper div height
  selector.style.height = radius * 2 + 'px';
  // let's set One Image width
  const oneImageWidth = (radius * 2) / 5;
  // radius is a center of wrapper div minus one Image width
  radius -= oneImageWidth;
  // taking into account image width while drawing a circle
  x -= oneImageWidth / 2;
  y -= oneImageWidth / 2;
  var centerX, centerY;
  const children = selector.children;
  const total = children.length;
  let alpha = (Math.PI * 2) / (total - 1);
  angle *= Math.PI / 180;
  for (let index = 0; index < total; index++) {
    if (index === 0) {
      allocateItem(children[index], x, y, oneImageWidth);
      centerX = x - oneImageWidth / 2;
      centerY = y - oneImageWidth / 2;
      continue;
    }
    // console.log('child', children[index]);

    const theta = alpha * index;
    const pointX = Math.floor(Math.cos(theta + angle) * radius);
    const pointY = Math.floor(Math.sin(theta + angle) * radius);
    allocateItem(children[index], pointX + x, pointY + y, oneImageWidth);
    // createSVG(selector, centerX, centerY, pointX + x, pointY + y);
  }
};

const allocateItem = (selector, left, top, width) => {
  selector.style.width = width + 'px';
  selector.style.left = left + 'px';
  selector.style.top = top + 'px';
};

// var svgNS = 'http://www.w3.org/2000/svg';
//
// const createSVG = (selector, centerX, centerY, endX, endY) => {
//   // creating svg wrapper
//   var newSVg = document.createElementNS(svgNS, 'svg');
//
//   newSVg.setAttributeNS(
//     null,
//     'style',
//     'position:absolute; top:0; left:0; z-index:0'
//   );
//   newSVg.setAttributeNS(null, 'width', 1000);
//   newSVg.setAttributeNS(null, 'height', 1000);
//
//   // creating line
//   var newLine = document.createElementNS(svgNS, 'line');
//
//   newLine.setAttributeNS(null, 'class', 'line');
//   newLine.setAttributeNS(null, 'x1', centerX);
//   newLine.setAttributeNS(null, 'y1', centerY);
//   newLine.setAttributeNS(null, 'x2', endX);
//   newLine.setAttributeNS(null, 'y2', endY);
//   newLine.setAttributeNS(null, 'stroke', 'black');
//   newLine.setAttributeNS(null, 'stroke_width', 1);
//
//   newSVg.appendChild(newLine);
//
//   selector.appendChild(newSVg);
// };
