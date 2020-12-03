'use strict';

const BaseCommand = require('./base-command');
const Logger      = require('../libraries/logger');

const MESSAGE_REGEX = /^(what|who) (is|are|was) (.+)$/i;

class AnswerCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug && result) {
      Logger.info({ msg: 'AnswerCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    if (this.gameEngine.questionBeingAsked()) {
      const rawGuess = msg.content.match(MESSAGE_REGEX)[3];
      await this.gameEngine.attemptAnswer(rawGuess, msg);
    } else if (this.debug) {
      Logger.info('AnswerCommand.handleMessage ignoring statement because not in game');
    }
  }
}

module.exports = AnswerCommand;
