'use strict';

const Bluebird = require('bluebird');
const Redis    = require('redis');

const Config = require('../../config');

Bluebird.promisifyAll(Redis.RedisClient.prototype);

module.exports = Redis.createClient({
  url: Config.REDIS_URL,
});
