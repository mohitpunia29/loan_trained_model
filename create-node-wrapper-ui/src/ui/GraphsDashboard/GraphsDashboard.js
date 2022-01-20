import React, { useState } from 'react';
import {
  flatten as _flatten,
  filter as _filter,
  map as _map,
  reject as _reject
} from 'lodash';

import {
  Category as AllIcon,
  ShowChart as LineChartIcon,
  ScatterPlot as ScatterChartIcon,
  Looks as AreaChartIcon,
  BarChart as BarChartIcon,
  BubbleChart as BubbleChartIcon,
  MultilineChart as ComposedChartIcon,
  PieChart as PieChartIcon,
  AllOut as RadarChartIcon,
  TrackChanges as RadialChartIcon,
  Dashboard as TreemapChartIcon,
  BlurLinear as HeatmapChartIcon,
  Language as MapIcon,
  Share as ForceDirectedIcon,
  ThreeDRotation as ThreeDIcon,
  Layers as LayersIcon
} from '@material-ui/icons';

import { Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import { Switch as RouteSwitch, Route, Redirect } from 'react-router';

import Menu from './Components/Menu/Menu';
import ChartContainer from '../Components/Graphs/Wrappers/Container/Container';
import Pseudo3dWrapper from '../Components/Graphs/Wrappers/Pseudo3dWrapper/Pseudo3dWrapper';
import Demo from '../Components/Graphs/Wrappers/Demo/Demo';
import { ResponsiveGrid } from '../Components/Graphs/Wrappers/Grid/Grid';

// Line charts
import SimpleLineChart from '../Components/Graphs/Charts/Line/Simple/Simple';

// Scatter charts
import SimpleScatterChart from '../Components/Graphs/Charts/Scatter/Simple/Simple';

// Area charts
import SimpleAreaChart from '../Components/Graphs/Charts/Area/Simple/Simple';
import StackedAreaChart from '../Components/Graphs/Charts/Area/Stacked/Stacked';
import FillByValueAreaChart from '../Components/Graphs/Charts/Area/FillByValue/FillByValue';

// Bar charts
import SimpleBarChart from '../Components/Graphs/Charts/Bar/Simple/Simple';
import CustomShapeBarChart from '../Components/Graphs/Charts/Bar/CustomShape/CustomShape';
import BrushBarChart from '../Components/Graphs/Charts/Bar/Brush/Brush';
import StackedBarChart from '../Components/Graphs/Charts/Bar/Stacked/Stacked';

// Bubble charts
import SimpleBubbleChart from '../Components/Graphs/Charts/Bubble/Simple/Simple';

// Composed charts
import ComposedChart from '../Components/Graphs/Charts/Composed/Composed/Composed';

// Pie charts
import TwoLevelPieChart from '../Components/Graphs/Charts/Pie/TwoLevel/TwoLevel';
import CustomActiveShapePieChart from '../Components/Graphs/Charts/Pie/CustomActiveShape/CustomActiveShape';
import StraightAnglePieChart from '../Components/Graphs/Charts/Pie/StraightAngle/StraightAngle';

// Radar charts
import SpecifiedDomainRadarChart from '../Components/Graphs/Charts/Radar/SpecifiedDomain/SpecifiedDomain';

// Radial charts
import SimpleRadialChart from '../Components/Graphs/Charts/Radial/Simple/Simple';

// Treemap charts
import SimpleTreemapChart from '../Components/Graphs/Charts/Treemap/Simple/Simple';
import CustomContentTreemapChart from '../Components/Graphs/Charts/Treemap/CustomContent/CustomContent';
// import CirclePacking from '../Components/Graphs/Charts/Treemap/CirclePacking/CirclePacking';
// import Sunburst from '../Components/Graphs/Charts/Treemap/Sunburst/Sunburst';
// import CircularDendrogram from '../Components/Graphs/Charts/Treemap/CircularDendrogram/CircularDendrogram';

// Heatmap charts
import SimpleHeatmapChart from '../Components/Graphs/Charts/Heatmap/Simple/Simple';

// Map charts
import DemoMap from '../Components/Graphs/Charts/Map/Demo/Demo';

// Force Directed
import RelationsForceDirectedChart from '../Components/Graphs/Charts/ForceDirected/Relations/Relations';

// 3D charts
import Bar3D from '../Components/Graphs/Charts/3D/Bar/Bar';
import ScatterPlot from '../Components/Graphs/Charts/3D/ScatterPlot/ScatterPlot';

// Chord charts
import Helix from '../Components/Graphs/Charts/NonRibbonChordDiagram/Layers/Layers';

import styles from './GraphsDashboard.module.css';

const MENU = _filter([{
  name  : 'line',
  icon  : LineChartIcon,
  charts: [{
    title: SimpleLineChart.displayName,
    chart: <Demo component={SimpleLineChart} />
  }, {
    title: `${SimpleLineChart.displayName} dashed`,
    chart: <Demo component={SimpleLineChart} withDashes />
  }]
}, {
  name  : 'scatter',
  icon  : ScatterChartIcon,
  charts: [{
    title: SimpleScatterChart.displayName,
    chart: <Demo component={SimpleScatterChart} />
  }, {
    title: `${SimpleScatterChart.displayName} with lines`,
    chart: <Demo component={SimpleScatterChart} withLines />
  }]
}, {
  name  : 'area',
  icon  : AreaChartIcon,
  charts: [{
    title: SimpleAreaChart.displayName,
    chart: <Demo component={SimpleAreaChart} />
  }, {
    title: StackedAreaChart.displayName,
    chart: <Demo component={StackedAreaChart} />
  }, {
    title: FillByValueAreaChart.displayName,
    chart: <Demo component={FillByValueAreaChart} />
  }]
}, {
  name  : 'bar',
  icon  : BarChartIcon,
  charts: [{
    title: SimpleBarChart.displayName,
    chart: <Demo component={SimpleBarChart} />
  }, {
    title: StackedBarChart.displayName,
    chart: <Demo component={StackedBarChart} />
  }, {
    title: CustomShapeBarChart.displayName,
    chart: <Demo component={CustomShapeBarChart} />
  }, {
    title: BrushBarChart.displayName,
    chart: <Demo component={BrushBarChart} />
  }]
}, {
  name  : 'bubble',
  icon  : BubbleChartIcon,
  charts: [{
    title: SimpleBubbleChart.displayName,
    chart: <Demo component={SimpleBubbleChart} />
  }]
}, {
  name  : 'composed',
  icon  : ComposedChartIcon,
  charts: [{
    title: ComposedChart.displayName,
    chart: <Demo component={ComposedChart} />
  }]
}, {
  name  : 'pie',
  icon  : PieChartIcon,
  charts: [{
    title: TwoLevelPieChart.displayName,
    chart: <Demo component={TwoLevelPieChart} />
  }, {
    title: CustomActiveShapePieChart.displayName,
    chart: <Demo component={CustomActiveShapePieChart} />
  }, {
    title: StraightAnglePieChart.displayName,
    chart: <Demo component={StraightAnglePieChart} />
  }]
}, {
  name  : 'radar',
  icon  : () => <span style={{ transform: 'rotate(45deg)' }}><RadarChartIcon /></span>,
  charts: [{
    title: SpecifiedDomainRadarChart.displayName,
    chart: <Demo component={SpecifiedDomainRadarChart} />
  }]
}, {
  name  : 'radial',
  icon  : () => <span style={{ transform: 'rotate(90deg)' }}><RadialChartIcon /></span>,
  charts: [{
    title: SimpleRadialChart.displayName,
    chart: <Demo component={SimpleRadialChart} />
  }]
}, {
  notInAll: true,
  name    : 'treemap',
  icon    : TreemapChartIcon,
  grid    : {
    breakpoints: {
      lg: 2,
      md: 1
    }
  },
  charts: [{
    title: SimpleTreemapChart.displayName,
    chart: <Demo component={SimpleTreemapChart} />
  }, {
    title: CustomContentTreemapChart.displayName,
    chart: <Demo component={CustomContentTreemapChart} />
  }]
}, {
  name  : 'chord',
  icon  : LayersIcon,
  charts: [{
    title: Helix.displayName,
    chart: <Demo component={Helix} size='xl' />
  }],
  padding: 0
}, {
  name  : 'heatmap',
  icon  : HeatmapChartIcon,
  charts: [{
    title: SimpleHeatmapChart.displayName,
    chart: <Demo component={SimpleHeatmapChart} />
  }]
}, {
  notInAll: true,
  name    : 'map',
  icon    : MapIcon,
  grid    : {
    height     : 'auto',
    breakpoints: {
      lg: 1,
      md: 1
    }
  },
  charts: [{
    title: 'Bubble/Connection Map',
    chart: <DemoMap />
  }]
}, {
  notInAll: true,
  name    : 'force directed',
  icon    : () => <span style={{ transform: 'translate(0, -4px) rotate(180deg)' }}><ForceDirectedIcon /></span>,
  charts  : [{
    title: RelationsForceDirectedChart.displayName,
    chart: <Demo component={RelationsForceDirectedChart} />
  }]
}, {
  notInAll: true,
  name    : '3D',
  icon    : ThreeDIcon,
  charts  : [{
    title: Bar3D.displayName,
    chart: <Demo component={Bar3D} />
  }, {
    title: ScatterPlot.displayName,
    chart: <Demo component={ScatterPlot} />
  }]
}], ({ charts }) => charts.length !== 0);

MENU.unshift({
  name  : 'overview',
  icon  : AllIcon,
  charts: _flatten(_map(
    _reject(MENU, 'notInAll'), 'charts'
  ))
});

const baseRoute = 'graphs-dashboard';

export default function GraphsDashboard() {
  const [rotated, setRotated] = useState(false);

  return (
    <div className={styles.root}>
      <nav className={styles.menu}>
        <FormGroup className={styles.rotateToggle}>
          <FormControlLabel
            control={(
              <Switch
                checked={rotated}
                onChange={(e) => setRotated(e.target.checked)}
                color='primary'
              />
            )}
            label='Rotated'
          />
        </FormGroup>
        <Menu
          menu={MENU}
          baseRoute={baseRoute}
        />
      </nav>
      <main className={styles.main}>
        <RouteSwitch>
          {_map(MENU, (page) => (
            <Route
              key={page.name}
              path={`/${baseRoute}/${page.name}`}
              render={() => (
                <ResponsiveGrid
                  height={page.grid && page.grid.height}
                  lg={page.grid && page.grid.breakpoints && page.grid.breakpoints.lg}
                  md={page.grid && page.grid.breakpoints && page.grid.breakpoints.md}
                  sm={page.grid && page.grid.breakpoints && page.grid.breakpoints.sm}
                  xs={page.grid && page.grid.breakpoints && page.grid.breakpoints.xs}
                >
                  {_map(page.charts, ({ title, chart, scale, padding }) => (
                    <ChartContainer
                      key={title}
                      title={title}
                      scale={scale}
                      padding={padding}
                      chart={(
                        <Pseudo3dWrapper
                          active={rotated}
                        >
                          {chart}
                        </Pseudo3dWrapper>
                      )}
                    />
                  ))}
                </ResponsiveGrid>
              )}
            />
          ))}
          <Route
            path={`/${baseRoute}`}
            render={() => (
              <Redirect exact strict to={`${baseRoute}/${MENU[0].name}`} />
            )}
          />
        </RouteSwitch>
      </main>
    </div>
  );
}
