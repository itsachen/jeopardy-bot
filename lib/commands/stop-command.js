'use strict';

const BaseCommand = require('./base-command');
const Logger      = require('../libraries/logger');

const MESSAGE_REGEX = /^!trivia\.stop/;

class StopCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug && result) {
      Logger.info({ msg: 'StopCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage () {
    if (this.gameEngine.questionBeingAsked()) {
      await this.gameEngine.stopRound();
    }
  }
}

module.exports = StopCommand;
