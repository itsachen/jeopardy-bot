'use strict';

const _                = require('lodash');
const StringSimilarity = require('string-similarity');

const Logger = require('./libraries/logger');

const STRING_SIMILARITY_THRESHOLD = .8;

const ARTICLE_REGEX = /^(the|a|an) /i;

const compare = (guess, actual) => {
  // Lowercase both the guess and the expected answer
  let modifiedGuess = guess;
  let modifiedActual = actual;

  modifiedGuess = modifiedGuess.toLowerCase();
  modifiedActual = modifiedActual.toLowerCase();

  // Remove articles (a, an, the) from both
  modifiedGuess = modifiedGuess.replace(ARTICLE_REGEX, '');
  modifiedActual = modifiedActual.replace(ARTICLE_REGEX, '');

  // Remove whitespace
  modifiedGuess = _.trim(modifiedGuess);
  modifiedActual = _.trim(modifiedActual);

  const score = StringSimilarity.compareTwoStrings(modifiedGuess, modifiedActual);

  const result = score >= STRING_SIMILARITY_THRESHOLD;

  Logger.info({ msg: 'AnswerComparison.compare', guess, actual, score, result });

  return result;
};

module.exports = {
  compare,
};
