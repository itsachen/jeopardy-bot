'use strict';

const AnswerComparison = require('../../lib/answer-comparison');

describe('AnswerComparison', () => {

  describe('compare', () => {

    describe('with punctuation', () => {

      it('ignores double quotes', () => {
        const guess = 'W';
        const actual = '"W"';
        expect(AnswerComparison.compare(guess, actual)).to.eq(true);
      });

      it('ignores single quotes', () => {
        const guess = 'as';
        const actual = 'a\'s';
        expect(AnswerComparison.compare(guess, actual)).to.eq(true);
      });

      it('ignores combination', () => {
        const guess = 'twas the night before christmas';
        const actual = '"\'Twas the Night Before Christmas" ("A Visit from St. Nicholas")"';
        expect(AnswerComparison.compare(guess, actual)).to.eq(true);
      });

      it('ignores periods', () => {
        const guess = 'c.s. lewis';
        const actual = 'C.S. Lewis';
        expect(AnswerComparison.compare(guess, actual)).to.eq(true);
      });

      it('ignores hyphens', () => {
        const guess = 'trick or treat';
        const actual = 'trick-or-treat';
        expect(AnswerComparison.compare(guess, actual)).to.eq(true);
      });

    });

  });

});
