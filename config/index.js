'use strict';

require('dotenv').config();

const DEFAULT = {
  DEBUG: false,
  HINT_TIMEOUT_MS: 7 * 1000,
  QUESTION_TIMEOUT_MS: 14 * 1000,
  BETWEEN_QUESTION_DELAY_MS: 2 * 1000,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
};

const environment = process.env.NODE_ENV || 'development';

module.exports = Object.assign({}, DEFAULT, require(`./${environment}`));
