'use strict';

const _                = require('lodash');
const StringSimilarity = require('string-similarity');

const Logger = require('./libraries/logger');

const STRING_SIMILARITY_THRESHOLD = .8;

const ARTICLE_REGEX = /^(the|a|an|to) /i;
const WORD_IN_PARENTHESES_REGEX = /\(\w+\)/;
const PARENTHESES_REGEX = /\(|\)/g;

const compare = (guess, actual) => {
  // Lowercase both the guess and the expected answer
  let modifiedGuess = guess;
  let modifiedActuals = [];

  // If actual answer has parentheses, consider both answers
  // Ex. (Ulysses) Grant - Accept "Ulysses Grant" and "Grant"
  if (actual.match(WORD_IN_PARENTHESES_REGEX)) {
    modifiedActuals.push(actual.replace(WORD_IN_PARENTHESES_REGEX, ''));
    modifiedActuals.push(actual.replace(PARENTHESES_REGEX, ''));
  } else {
    modifiedActuals.push(actual);
  }

  modifiedGuess = modifiedGuess.toLowerCase();
  modifiedActuals = modifiedActuals.map((s) => s.toLowerCase());

  // Remove articles (a, an, the) from both
  modifiedGuess = modifiedGuess.replace(ARTICLE_REGEX, '');
  modifiedActuals = modifiedActuals.map((s) => s.replace(ARTICLE_REGEX, ''));

  // Remove whitespace
  modifiedGuess = _.trim(modifiedGuess);
  modifiedActuals = modifiedActuals.map((s) => _.trim(s));

  const scores = modifiedActuals.map((s) => StringSimilarity.compareTwoStrings(modifiedGuess, s));

  const result = scores.some((score) => score >= STRING_SIMILARITY_THRESHOLD);

  Logger.info({ msg: 'AnswerComparison.compare', guess, actual, modifiedActuals, scores, result });

  return result;
};

module.exports = {
  compare,
};
