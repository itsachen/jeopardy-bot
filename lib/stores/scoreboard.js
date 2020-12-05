'use strict';

const Redis = require('../libraries/redis');

// user is https://discord.js.org/#/docs/main/stable/class/User
const _userScoreKey = (user) => {
  return `score:user:${user.id}`;
};

const getScore = async (user) => {
  const score = await Redis.getAsync(_userScoreKey(user));
  return score;
};

const increaseScore = async (user, value) => {
  return Redis.incrbyAsync(_userScoreKey(user), value);
};

const decreaseScore = async (user, value) => {
  return Redis.decrbyAsync(_userScoreKey(user), value);
};

const resetScore = async (user) => {
  return Redis.setAsync(_userScoreKey(user), 0);
};

module.exports = {
  getScore,
  increaseScore,
  decreaseScore,
  resetScore,
};
