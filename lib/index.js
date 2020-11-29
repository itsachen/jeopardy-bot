'use strict';

const Config = require('../config');

const Bot = require('./bot');

const bot = new Bot({ token: Config.DISCORD_API_TOKEN, debug: Config.DEBUG });
bot.start();
