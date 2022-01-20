export default {
  chartData: {
    data: [{
      name: 'A school',
      data: [
        { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
        { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
        { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }
      ]
    }, {
      name: 'B school',
      data: [
        { x: 200, y: 260, z: 240 }, { x: 240, y: 290, z: 220 },
        { x: 190, y: 290, z: 250 }, { x: 198, y: 250, z: 210 },
        { x: 180, y: 280, z: 260 }, { x: 210, y: 220, z: 230 }
      ]
    }],
    xAxis: {
      type   : 'number',
      dataKey: 'x',
      name   : 'stature',
      unit   : 'cm'
    },
    yAxis: {
      type   : 'number',
      dataKey: 'y',
      name   : 'weight',
      unit   : 'kg'
    },
    zAxis: {
      type   : 'number',
      dataKey: 'z',
      name   : 'score',
      unit   : 'km',
      range  : [10, 100]
    }
  }
};
