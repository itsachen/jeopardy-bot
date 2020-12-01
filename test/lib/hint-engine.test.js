'use strict';

const HintEngine = require('../../lib/hint-engine');

describe('HintEngine', () => {

  describe('generateHint', () => {

    it('handles one character answers', () => {
      const answer = '6%';
      const hint = HintEngine.generateHint(answer);

      expect(hint).to.eq('•%');
    });

  });

});
