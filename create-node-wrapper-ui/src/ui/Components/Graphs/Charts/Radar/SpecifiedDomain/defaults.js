export default {
  chartData: {
    data: [
      { subject: 'Math', A: 120, B: 110 },
      { subject: 'Chinese', A: 98, B: 130 },
      { subject: 'English', A: 86, B: 130 },
      { subject: 'Geography', A: 99, B: 100 },
      { subject: 'Physics', A: 85, B: 90 },
      { subject: 'History', A: 65, B: 85 }
    ],
    dataKey: 'subject',
    areas  : [{
      dataKey: 'A',
      name   : 'Milly',
      opacity: 0.6
    }, {
      dataKey: 'B',
      name   : 'Lily',
      opacity: 0.6
    }]
  }
};
