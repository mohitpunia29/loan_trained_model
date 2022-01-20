/* eslint-disable array-bracket-spacing */
/* eslint-disable comma-spacing */
/* eslint-disable no-multi-spaces */

const LIMIT = 2;

function round(num) {
  // eslint-disable-next-line prefer-template
  return +(Math.round(num + 'e+5')  + 'e-5');
}

function properCoordinates(marker) {
  return true;
  const [lat, long] = marker.coordinates;
  if (typeof lat === 'string' || typeof long === 'string') return false;
  if (lat < -90 || lat > 90) return false;
  if (long < -180 || lat > 180) return false;
  return true;
}

function markerRadius(size) {
  if (!size) return 0.5;
  const length = round(Math.abs(Math.log10(size / 500000)));
  return length < LIMIT ? length : LIMIT;
}

function square(coord, l) {
  let [x, y] = coord;
  // these hacks are not needed with this dataset
  // if ((x - LIMIT) <= -90)  x = -90 + LIMIT;
  // if ((x + LIMIT) >= 90)   x = 90 - LIMIT;
  // if ((y - LIMIT) <= -180) y = -180 + LIMIT;
  // if ((y + LIMIT) >= 180)  y = 180 - LIMIT;
  // with yl we counter distortion of markers
  const yl = l * (180 - Math.abs(y) * 1.5) / 180;
  return [
    [round(x - l), round(y - yl)],
    [round(x - l), round(y + yl)],
    [round(x + l), round(y + yl)],
    [round(x + l), round(y - yl)],
    [round(x - l), round(y - yl)]
  ];
}

function polygon(coord, l) {
  let [x, y] = coord;
  const o = round(l / 2.5);
  if ((x - LIMIT) <= -90)  x = -90 + LIMIT;
  if ((x + LIMIT) >= 90)   x = 90 - LIMIT;
  if ((y - LIMIT) <= -180) y = -180 + LIMIT;
  if ((y + LIMIT) >= 180)  y = 180 - LIMIT;
  return [
    [round(x - l), y    ],
    [round(x - o), round(y + o)],
    [x    , round(y + l)],
    [round(x + o), round(y + o)],
    [round(x + l), y    ],
    [round(x + o), round(y - o)],
    [x    , round(y - l)],
    [round(x - o), round(y - o)],
    [round(x - l), y    ]
  ];
}

export default function getGeoMarkers(markers) {
  return markers
    .filter(properCoordinates)
    .map((marker) => ({
      type      : 'Feature',
      properties: {
        id         : marker.id,
        name       : marker.name,
        size       : marker.size,
        type       : marker.type,
        coordinates: marker.coordinates
      },
      geometry: {
        type       : 'Polygon',
        coordinates: [[
          ...square(marker.coordinates, markerRadius(marker.size))
          // ...polygon(marker.coordinates, markerRadius(marker.size))
        ]]
      }
    }));
}
