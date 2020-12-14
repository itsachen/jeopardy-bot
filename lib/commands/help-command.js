'use strict';

const Discord = require('discord.js');

const BaseCommand = require('./base-command');
const Config      = require('../../config');
const Logger      = require('../libraries/logger');

const MESSAGE_REGEX = /^!trivia\.help$/;

class HelpCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug && result) {
      Logger.info({ msg: 'HelpCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    msg.channel.send(this._formatHelpEmbed());
  }

  _formatHelpEmbed () {
    return new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Jeopardy Bot - Help')
      .setDescription('Jeopardy Bot is an [open source](https://github.com/itsachen/jeopardy-bot) Discord trivia bot. To use:')
      .addFields(
        { name: '!trivia (n)', value: `Starts a round of \`n\` questions. If no number is provided, defaults to 1.\nYou have **${Config.QUESTION_TIMEOUT_MS / 1000}s** to answer the question. A hint is provided after **${Config.HINT_TIMEOUT_MS / 1000}s**.` },
        { name: 'what/who is/are/was', value: 'Submits an answer.' },
        { name: '\u200B', value: '\u200B' },
        { name: '!trivia.skip', value: 'Skips the current question.', inline: true },
        { name: '!trivia.stats', value: 'Shows historical stats.', inline: true },
        { name: '!trivia.reset', value: 'Resets your score.', inline: true },
        { name: '!trivia.help', value: 'Displays commands.', inline: true },
      );
  }
}

module.exports = HelpCommand;
