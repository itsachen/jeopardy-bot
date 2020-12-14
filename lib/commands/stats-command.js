'use strict';

const Discord = require('discord.js');

const BaseCommand       = require('./base-command');
const DiscordFormatting = require('../utils/discord-formatting');
const Logger            = require('../libraries/logger');
const Scoreboard        = require('../stores/scoreboard');
const Stats             = require('../stores/stats');
const StringUtils       = require('../utils/string-utils');

const MESSAGE_REGEX = /^!trivia\.stats/;

class StatsCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug && result) {
      Logger.info({ msg: 'StatsCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    const user = msg.author;

    const stats = await Stats.getStats(user);
    if (this.debug) {
      Logger.info({ msg: 'StatsCommand.handleMessage', stats });
    }

    const score = await Scoreboard.getScore(user);

    msg.channel.send(this._formatStatsEmbed(user, stats, score));
  }

  _formatStatsEmbed (user, statsHash, score) {

    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Jeopardy Bot - Stats')
      .setDescription(`Statistics for ${user}:`)
      .addFields(
        { name: '💰 Current score', value: StringUtils.formatMoney(score) },
        { name: '📈 Total correct', value: statsHash[Stats.STATS_HASH_FIELDS.CORRECT], inline: true },
        { name: '📉 Total incorrect', value: statsHash[Stats.STATS_HASH_FIELDS.INCORRECT], inline: true },
      )
      .setTimestamp();

    const fastestAnswer = statsHash[Stats.STATS_HASH_FIELDS.FASTEST_ANSWER];
    const fastestAnswerTimeMs = parseInt(statsHash[Stats.STATS_HASH_FIELDS.FASTEST_ANSWER_MS]);

    if (fastestAnswer && fastestAnswerTimeMs) {
      embed.addField(
        '🏎 Fastest response',
        `${DiscordFormatting.bold(StringUtils.capitalize(fastestAnswer))} in ${DiscordFormatting.bold(StringUtils.formatMs(fastestAnswerTimeMs))}`,
      );
    }

    return embed;
  }

}

module.exports = StatsCommand;
