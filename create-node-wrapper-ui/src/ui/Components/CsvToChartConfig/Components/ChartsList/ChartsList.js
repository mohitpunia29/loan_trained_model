import React from 'react';
import PropTypes from 'prop-types';
import {
  isEqual as _isEqual,
  map as _map
} from 'lodash';
import bindClassnames from 'classnames/bind';

import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';

// Line charts
import SimpleLineChart from '../../../Graphs/Charts/Line/Simple/Simple';

// Scatter charts
import SimpleScatterChart from '../../../Graphs/Charts/Scatter/Simple/Simple';

// Area charts
import SimpleAreaChart from '../../../Graphs/Charts/Area/Simple/Simple';
import StackedAreaChart from '../../../Graphs/Charts/Area/Stacked/Stacked';
import FillByValueAreaChart from '../../../Graphs/Charts/Area/FillByValue/FillByValue';

// Bar charts
import SimpleBarChart from '../../../Graphs/Charts/Bar/Simple/Simple';
import CustomeShapeBarChart from '../../../Graphs/Charts/Bar/CustomShape/CustomShape';
import StackedBarChart from '../../../Graphs/Charts/Bar/Stacked/Stacked';
import BrushBarChart from '../../../Graphs/Charts/Bar/Brush/Brush';

// Bubble charts
import SimpleBubbleChart from '../../../Graphs/Charts/Bubble/Simple/Simple';

// Composed charts
import ComposedChart from '../../../Graphs/Charts/Composed/Composed/Composed';

// Pie charts
import TwoLevelPieChart from '../../../Graphs/Charts/Pie/TwoLevel/TwoLevel';
import CustomActiveShapePieChart from '../../../Graphs/Charts/Pie/CustomActiveShape/CustomActiveShape';
import StraightAnglePieChart from '../../../Graphs/Charts/Pie/StraightAngle/StraightAngle';

// Radar charts
import SpecifiedDomainRadarChart from '../../../Graphs/Charts/Radar/SpecifiedDomain/SpecifiedDomain';

// Radial charts
import SimpleRadialChart from '../../../Graphs/Charts/Radial/Simple/Simple';

// Treemap charts
import SimpleTreemapChart from '../../../Graphs/Charts/Treemap/Simple/Simple';
import CustomContentTreemapChart from '../../../Graphs/Charts/Treemap/CustomContent/CustomContent';
// import CirclePacking from '../../../Graphs/Charts/Treemap/CirclePacking/CirclePacking';
// import Sunburst from '../../../Graphs/Charts/Treemap/Sunburst/Sunburst';
// import CircularDendrogram from '../../../Graphs/Charts/Treemap/CircularDendrogram/CircularDendrogram';

// Heatmap charts
import SimpleHeatmapChart from '../../../Graphs/Charts/Heatmap/Simple/Simple';

// Map charts
import GeoMap from '../../../Graphs/Charts/Map/Geo/Geo';

// Force directed
import RelationsForceDirectedChart from '../../../Graphs/Charts/ForceDirected/Relations/Relations';

// 3D charts
import Bar3D from '../../../Graphs/Charts/3D/Bar/Bar';
import ScatterPlot from '../../../Graphs/Charts/3D/ScatterPlot/ScatterPlot';

import styles from './ChartsList.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

const list = [{
  name : SimpleLineChart.displayName,
  chart: SimpleLineChart
}, {
  name : SimpleScatterChart.displayName,
  chart: SimpleScatterChart,
  disabled: true
}, {
  name : SimpleAreaChart.displayName,
  chart: SimpleAreaChart
}, {
  name : StackedAreaChart.displayName,
  chart: StackedAreaChart
}, {
  name : FillByValueAreaChart.displayName,
  chart: FillByValueAreaChart
}, {
  name : SimpleBarChart.displayName,
  chart: SimpleBarChart
}, {
  name : CustomeShapeBarChart.displayName,
  chart: CustomeShapeBarChart
}, {
  name : StackedBarChart.displayName,
  chart: StackedBarChart
}, {
  name : BrushBarChart.displayName,
  chart: BrushBarChart
}, {
  name : SimpleBubbleChart.displayName,
  chart: SimpleBubbleChart
}, {
  name : ComposedChart.displayName,
  chart: ComposedChart,
  disabled: true
}, {
  name : TwoLevelPieChart.displayName,
  chart: TwoLevelPieChart
}, {
  name : CustomActiveShapePieChart.displayName,
  chart: CustomActiveShapePieChart
}, {
  name : StraightAnglePieChart.displayName,
  chart: StraightAnglePieChart
}, {
  name : SpecifiedDomainRadarChart.displayName,
  chart: SpecifiedDomainRadarChart,
  disabled: true
}, {
  name : SimpleRadialChart.displayName,
  chart: SimpleRadialChart
}, {
  name : SimpleTreemapChart.displayName,
  chart: SimpleTreemapChart,
  disabled: true
}, {
  name : CustomContentTreemapChart.displayName,
  chart: CustomContentTreemapChart,
  disabled: true
}, {
  name : SimpleHeatmapChart.displayName,
  chart: SimpleHeatmapChart
}, {
  name : GeoMap.displayName,
  chart: GeoMap,
  disabled: true
}, {
  name : RelationsForceDirectedChart.displayName,
  chart: RelationsForceDirectedChart
}, {
  name : Bar3D.displayName,
  chart: Bar3D
}, {
  name : ScatterPlot.displayName,
  chart: ScatterPlot
}];

export default function ChartsList({ selectedChart, selectChart }) {
  function handleSelectChart(chart) {
    selectChart(() => (chart));
  }

  return (
    <Grid
      container
      spacing={8}
    >
      {_map(list, ({ name, chart, disabled }) => (
        <Grid
          key={name}
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          onClick={() => !disabled && handleSelectChart(chart)}
        >
          <ChartCard
            name={name}
            chart={chart}
            isSelected={_isEqual(chart, selectedChart)}
            disabled={disabled}
          />
        </Grid>
      ))}
    </Grid>
  );
}

ChartsList.propTypes = {
  selectedChart: PropTypes.func,
  selectChart  : PropTypes.func.isRequired
};

ChartsList.defaultProps = {
  selectedChart: undefined
};

function ChartCard({ name, chart, isSelected, disabled }) {
  return (
    <Card className={classnames({ cardDisabled: disabled })}>
      <CardActionArea>
        <CardMedia
          component='img'
          alt={name}
          classes={{ root: classnames('thumbnail') }}
          height='190'
          image={chart.thumbnail}
          title={name}
        />
        <CardContent
          classes={{ root: classnames({ selected: isSelected }) }}
        >
          <Typography
            variant='h6'
            classes={{ root: classnames({ textSelected: isSelected }) }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

ChartCard.propTypes = {
  name      : PropTypes.string.isRequired,
  chart     : PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired
};
