'use strict';

const Config = require('../../config');
const Logger = require('../libraries/logger');
const Redis  = require('../libraries/redis');

const STATS_HASH_FIELDS = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  FASTEST_ANSWER_MS: 'fastest_answer_ms',
  FASTEST_ANSWER: 'fastest_answer',
};

// user is https://discord.js.org/#/docs/main/stable/class/User
const _userStatsKey = (user) => {
  return `stats:user:${user.id}`;
};

const getStats = async (user) => {
  return Redis.hgetallAsync(_userStatsKey(user));
};

const incrCorrectStat = async (user) => {
  return Redis.hincrbyAsync(_userStatsKey(user), STATS_HASH_FIELDS.CORRECT, 1);
};

const incrIncorrectStat = async (user) => {
  return Redis.hincrbyAsync(_userStatsKey(user), STATS_HASH_FIELDS.INCORRECT, 1);
};

const recordAnswerAndTime = async (user, answer, timeMs) => {
  // Convert to lua script for atomicity if I care enough
  if (Config.DEBUG) {
    Logger.info({ msg: 'Stats.recordAnswerTime', timeMs });
  }

  const rawPrevFastestAnswerMs = await Redis.hgetAsync(_userStatsKey(user), STATS_HASH_FIELDS.FASTEST_ANSWER_MS);

  if (!rawPrevFastestAnswerMs || timeMs < parseInt(rawPrevFastestAnswerMs)) {
    if (Config.DEBUG) {
      Logger.info({ msg: 'Stats.recordAnswerTime - faster than previous time', rawPrevFastestAnswerMs });
    }

    const update = {};
    update[STATS_HASH_FIELDS.FASTEST_ANSWER] = answer;
    update[STATS_HASH_FIELDS.FASTEST_ANSWER_MS] = timeMs;

    await Redis.hmsetAsync(_userStatsKey(user), update);
  }
};

module.exports = {
  STATS_HASH_FIELDS,
  getStats,
  incrCorrectStat,
  incrIncorrectStat,
  recordAnswerAndTime,
};
