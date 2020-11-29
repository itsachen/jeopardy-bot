'use strict';

const _ = require('lodash');

const CHAR_REGEX = /^\w$/;

const PERCENT_TO_REVEAL = 0.3;
const OBFSUCATE_CHAR = '•';

const _obfuscateWord = (word, percentToReveal, obfsucateChar) => {
  // Only consider alphanumeric characters
  const charIndices = new Set();

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (char.match(CHAR_REGEX)) {
      charIndices.add(i);
    }
  }

  const numRevealedLetters = Math.max(1, Math.floor(charIndices.size * percentToReveal));
  const indicesToReveal = new Set(_.sampleSize(Array.from(charIndices), numRevealedLetters));

  let result = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    // Reveal if chosen, or if is non-alphanumeric
    if (indicesToReveal.has(i) || !charIndices.has(i)) {
      result += char;
    } else {
      result += obfsucateChar;
    }
  }

  return result;
};

const generateHint = (answer) => {
  const words = answer.split(' ');
  const obfuscatedWords = words.map((word) => _obfuscateWord(word, PERCENT_TO_REVEAL, OBFSUCATE_CHAR));

  return obfuscatedWords.join(' ');
};

module.exports = {
  generateHint,
};
