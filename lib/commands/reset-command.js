'use strict';

const BaseCommand = require('./base-command');
const Logger      = require('../libraries/logger');
const Scoreboard  = require('../scoreboard');

const MESSAGE_REGEX = /^!trivia\.reset/;

class ResetCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug) {
      Logger.info({ msg: 'ResetCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    const targetUser = msg.author;
    await Scoreboard.resetScore(targetUser);
    msg.channel.send(this._formatResetMessage(targetUser));
  }

  _formatResetMessage (user) {
    return `Reset ${user}'s score to $0.`;
  }
}

module.exports = ResetCommand;
