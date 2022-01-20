const { expect } = require('chai');

const guessType = require('./guessType');

describe('#guessType', function() {
  it('Can make sure that parsing boolean works', function() {
    const input = ['true', 'false'];
    const EXPECTED_TYPE = 'BOOL';

    for (let i = 0; i < input.length; i++) {
      const result = guessType(input, i);

      expect(result).to.equal(EXPECTED_TYPE);
    }
  });
});
