'use strict';

const Bluebird = require('bluebird');
const Redis    = require('redis');

const Config = require('../../config');

Bluebird.promisifyAll(Redis.RedisClient.prototype);

module.exports = Redis.createClient({
  host: Config.REDIS_HOST,
  port: Config.REDIS_PORT,
});
