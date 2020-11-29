'use strict';

const BaseCommand = require('./base-command');
const Logger      = require('../libraries/logger');

const MESSAGE_REGEX = /^!trivia(\s\d+)?\s*$/;

class TriviaCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug) {
      Logger.info({ msg: 'TriviaCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    if (this.debug) {
      Logger.info('TriviaCommand.handleMessage');
    }
    const match = msg.content.match(MESSAGE_REGEX);
    const numQuestions = match[1] === undefined ? 1 : parseInt(match[1].trim());

    if (!this.gameEngine.questionBeingAsked()) {
      // Initialize round in game engine with numQuestions
      await this.gameEngine.startRound(numQuestions, msg.channel);
    } else {
      msg.channel.send('A question is already being asked.');
    }
  }
}

module.exports = TriviaCommand;
