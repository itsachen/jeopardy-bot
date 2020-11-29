'use strict';

const Redis = require('./libraries/redis');

// user is https://discord.js.org/#/docs/main/stable/class/User
const getScore = async (user) => {
  const score = await Redis.getAsync(`score:user:${user.id}`);
  return score;
};

const increaseScore = async (user, value) => {
  return Redis.incrbyAsync(`score:user:${user.id}`, value);
};

const decreaseScore = async (user, value) => {
  return Redis.decrbyAsync(`score:user:${user.id}`, value);
};

const resetScore = async (user) => {
  return Redis.setAsync(`score:user:${user.id}`, 0);
};

module.exports = {
  getScore,
  increaseScore,
  decreaseScore,
  resetScore,
};
