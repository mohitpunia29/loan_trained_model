/* eslint-disable react/no-array-index-key */
/* eslint-disable no-multi-spaces */
import React, { useState, useEffect, useRef } from 'react';
import propTypeSchema from 'react-json-schema-proptypes';
import bindClassnames from 'classnames/bind';

import { geoMercator, geoOrthographic, geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import useRefDimensions from '../../../../../Hooks/useRefDimensions';

import Node from '../../../../SVG/Node/Node';
import Tooltip from '../../../../SVG/Tooltip/Tooltip';

import styles from './Geo.module.css';

import defaultData from './defaults';
import thumbnail from './thumbnail.png';

// Bind to classnames
const classnames = bindClassnames.bind(styles);

// theme colours
const COUNTRIES_BG = getComputedStyle(document.documentElement).getPropertyValue('--map-countries');
const ACTIVE_COUNTRY_BG = getComputedStyle(document.documentElement).getPropertyValue('--map-active-country');
const MARKER_BG_1 = getComputedStyle(document.documentElement).getPropertyValue('--map-marker-1');
const MARKER_BG_2 = getComputedStyle(document.documentElement).getPropertyValue('--map-marker-2');
const MARKER_BG_3 = getComputedStyle(document.documentElement).getPropertyValue('--map-marker-3');

// basic params for rendering svg map
const vars = {
  mercator: {
    projection  : geoMercator,
    DEFAULT_SIZE: 700,
    RATIO       : 1.8
  },
  orthographic: {
    projection  : geoOrthographic,
    DEFAULT_SIZE: 220,
    RATIO       : 1,
    rotate      : true,
    rotateStep  : 5
  },
  equalEarth: {
    projection  : geoEqualEarth,
    DEFAULT_SIZE: 500,
    RATIO       : 1.9
  }
};

const DEFAULT_WIDTH = 800;

export default function Geo({ topology, projection, markers, connections, showConnections, showLabels, showAsGlobe }) {
  const [mapData, setMapData] = useState();
  const [activeCountry, setActiveCountry] = useState();
  const [activeMarker, setActiveMarker] = useState(null);
  const rootRef = useRef(null);
  const [{ width: containerWidth, height: containerHeight }, onResize] = useRefDimensions(rootRef, { width: DEFAULT_WIDTH, height: DEFAULT_WIDTH });

  const [rotate, setRotate] = useState(0);
  const gestures = useDrag(({ /* delta, velocity, */ direction }) => {
    if (vars[projection].rotate) {
      const step = vars[projection].rotateStep;
      const [directionX] = direction;
      if (directionX > 0) setRotate(rotate + step);
      if (directionX < 0) setRotate(rotate - step);
      // console.log(`delta: ${delta} velocity: ${velocity} direction: ${direction}`);
    }
  });

  const width = (containerWidth / vars[projection].RATIO) < containerHeight ?
    containerWidth : containerHeight * vars[projection].RATIO;

  const height = width / vars[projection].RATIO;
  const scale = 100 * width / vars[projection].DEFAULT_SIZE;

  useEffect(() => {
    const handleLoadingTopology = (data) => {
      setMapData(feature(data, data.objects.countries).features);
      onResize();
    };

    if (topology === 'world') {
      // Webpack code splitting
      import('../Topology/world-110m.json').then(handleLoadingTopology);
    }
    // this will not work at the moment
    if (topology === 'us') {
      import('../Topology/us.json').then(handleLoadingTopology);
    }
  }, []);

  function transform() {
    return vars[projection].projection()
      .scale(scale)
      .rotate([rotate, 0, 0])
      .translate([width / 2, height / 2]);
  }

  function handleCountryClick(countryIndex) {
    console.log('Clicked on country: ', mapData[countryIndex]);
  }

  function handleMarkerClick(i) {
    console.log('Marker: ', markers[i], activeMarker);
  }

  function countryFill(i) {
    if (i === activeCountry) return ACTIVE_COUNTRY_BG;
    // let opacity = 1 / mapData.length * i;
    // if (opacity < 0.1) opacity = 0.1;
    const countryName = mapData[i].properties.NAME_LONG;
    const opacity = markers.find((marker) => marker.name.toLowerCase() === countryName.toLowerCase()) ?
      0.8 : 0.4;
    return COUNTRIES_BG.replace('X', opacity);
  }

  function markerRadius(i) {
    return Math.log10(markers[i].size) * 2;
    // return markers[i].size / 3000000;
  }

  function markerColor(i) {
    if (['GSC', 'gsc_x'].indexOf(markers[i].type) !== -1) return MARKER_BG_1;
    if (['BP Entity', 'bp_entity'].indexOf(markers[i].type) !== -1) return MARKER_BG_2;
    return MARKER_BG_3;
  }

  function getMarkerById(id) {
    return markers.find((marker => marker.id === id));
  }

  const animate = useSpring({ opacity: 1, from: { opacity: 0 } });

  if (!mapData) return null;

  return (
    <div
      className={classnames('root')}
      ref={rootRef}
      {...gestures()}
    >
      <div
        style={{
          width,
          height
        }}
      >
        <animated.svg
          style={animate}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g className='countries'>
            {
              mapData.map((d, i) => (
                <path
                  key={`path-${i}`}
                  d={geoPath().projection(transform())(d)}
                  className='country'
                  fill={countryFill(i)}
                  stroke='#FFFFFF'
                  strokeWidth={0.5}
                  onClick={() => handleCountryClick(i)}
                  onFocus={() => setActiveCountry(i)}
                  onMouseOver={() => setActiveCountry(i)}
                  onMouseLeave={() => setActiveCountry()}
                />
              ))
            }
          </g>
          <g className='connections'>
            { showConnections &&
              connections.map((connection, i) => {
                if (getMarkerById(connection.start) && getMarkerById(connection.finish)) {
                  const [sx, sy] = transform()(getMarkerById(connection.start).coordinates);
                  const [fx, fy] = transform()(getMarkerById(connection.finish).coordinates);
                  let activeConnection = null;
                  if (activeMarker) {
                    activeConnection = connection.start === markers[activeMarker].id ||
                      connection.finish === markers[activeMarker].id ? 'activeConnection' : null;
                  }

                  let cx = (fx + sx) / 2;
                  let cy = (fy + sy) / 2;
                  cx > width / 2 ? cx += 50 : cx -= 50;
                  cy > height / 2 ? cy += 50 : cy -= 50;

                  return (
                    <path
                      key={`${sx}-${Math.random()}`}
                      d={`M${sx},${sy} Q${cx},${cy} ${fx},${fy}`}
                      className={classnames('connection', activeConnection)}
                    />
                  );
                }
              })
            }
          </g>
          <g className='markers'>
            {
              markers.map((marker, i) => (
                <Node
                  key={`marker-${i}`}
                  content={{
                    label : marker.name,
                    color : markerColor(i),
                    radius: markerRadius(i)
                  }}
                  transformations={{
                    x: transform()(marker.coordinates)[0],
                    y: transform()(marker.coordinates)[1]
                  }}
                  actions={{
                    onClick: () => handleMarkerClick(i),
                    onHover: () => setActiveMarker(i),
                    onLeave: () => setActiveMarker(null)
                  }}
                  showLabels={showLabels}
                />
              ))
            }
          </g>
        </animated.svg>
        {activeMarker !== null && (
          <Tooltip
            transformations={{
              x: transform()(markers[activeMarker].coordinates)[0],
              y: transform()(markers[activeMarker].coordinates)[1]
            }}
            container={{
              width,
              height
            }}
          >
            {TooltipContent(markers[activeMarker])}
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function TooltipContent(marker) {
  return marker.tooltip ? (
    <div className={classnames('tooltipContent')}>
      <div className={classnames('tooltipInner')}>
        {Object.keys(marker.tooltip).map((key) => (
          <div className={classnames('row')} key={`tooltip-${key}`}>
            <span>{key}</span>
            <span>{marker.tooltip[key]}</span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className={classnames('tooltipContent')}>
      <span>{`City: ${marker.name}`}</span>
      <span>{`Code:${marker.id}`}</span>
      <span>{`Transactions: ${marker.size}`}</span>
    </div>
  );
}

Geo.displayName = 'Map';

Geo.propTypesSchema = {
  type      : 'object',
  properties: {
    topology: {
      type: 'string'
    },
    projection: {
      displayName: 'projection',
      type       : 'string',
      source     : 'enum',
      enum       : ['mercator', 'orthographic', 'equalEarth']
    },
    markers: {
      type : 'array',
      items: {
        type: 'object'
      }
    },
    connections: {
      type : 'array',
      items: {
        type: 'object'
      }
    },
    showConnections: {
      displayName: 'connections',
      type       : 'boolean'
    },
    showLabels: {
      displayName: 'labels',
      type       : 'boolean'
    }
  }
};

Geo.propTypes = propTypeSchema(Geo.propTypesSchema);

Geo.defaultProps = {
  topology       : 'world',
  projection     : 'mercator',
  markers        : [],
  connections    : [],
  showConnections: false,
  showLabels     : false,
  showAsGlobe    : false
};

// export the default
Geo.defaultData = defaultData;

Geo.thumbnail = thumbnail;
