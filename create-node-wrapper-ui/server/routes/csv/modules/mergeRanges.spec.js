const expect = require('chai').expect;

const mergeRanges = require('./mergeRanges');

const USE_CASES = [{
  ranges: [[3, 4]],
  output: [[3, 4]]
}, {
  ranges: [[10, 11], [13, 15]],
  output: [[10, 11], [13, 15]]
}, {
  ranges: [[10], [12]],
  output: [[10, 10], [12, 12]]
}, {
  ranges: [[10], [11]],
  output: [[10, 11]]
}, {
  ranges: [[10, 14], [14]],
  output: [[10, 14]]
}, {
  ranges: [[10], [10, 14]],
  output: [[10, 14]]
}, {
  ranges: [[10, 14], [14, 18]],
  output: [[10, 18]]
}, {
  ranges: [[10, 14], [15, 18]],
  output: [[10, 18]]
}, {
  ranges: [[1, 5], [10, 15], [20, 25]],
  output: [[1, 5], [10, 15], [20, 25]]
}, {
  ranges: [[20, 25], [1, 5], [10, 12], [13, 15]],
  output: [[1, 5], [10, 15], [20, 25]]
}];

describe('#Techtonik - modules - mergeRanges', function() {
  for (const useCase of USE_CASES) {
    it(`Can make sure all mergeRanges can properly merge [[${useCase.ranges.join('], [')}]]`, function() {
      expect(mergeRanges(useCase.ranges)).to.eql(useCase.output);
    });
  }
});
