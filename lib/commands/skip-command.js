'use strict';

const BaseCommand = require('./base-command');
const Logger      = require('../libraries/logger');

const MESSAGE_REGEX = /^!trivia\.skip/;

class SkipCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug && result) {
      Logger.info({ msg: 'SkipCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    if (this.gameEngine.questionBeingAsked()) {
      await this.gameEngine.skipCurrentQuestion(msg.createdTimestamp, msg.channel);
    }
  }
}

module.exports = SkipCommand;
