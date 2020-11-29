'use strict';

require('dotenv').config();

const DEFAULT = {
  DEBUG: process.env.DEBUG === 'true' || false,
  HINT_TIMEOUT_MS: process.env.HINT_TIMEOUT_MS || 7 * 1000,
  QUESTION_TIMEOUT_MS: process.env.QUESTION_TIMEOUT_MS || 14 * 1000,
  BETWEEN_QUESTION_DELAY_MS: process.env.BETWEEN_QUESTION_DELAY_MS || 2 * 1000,
  REDIS_URL: process.env.REDIS_URL,
  DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
};

const environment = process.env.NODE_ENV || 'development';

module.exports = Object.assign({}, DEFAULT, require(`./${environment}`));
