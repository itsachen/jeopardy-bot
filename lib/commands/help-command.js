'use strict';

const BaseCommand = require('./base-command');
const Logger      = require('../libraries/logger');

const MESSAGE_REGEX = /^!trivia\.help$/;

class HelpCommand extends BaseCommand {
  constructor (args) {
    super(args);
  }

  messageMatcher (msg) {
    const result = msg.content.match(MESSAGE_REGEX) !== null;
    if (this.debug) {
      Logger.info({ msg: 'HelpCommand.messageMatcher', result });
    }

    return result;
  }

  async handleMessage (msg) {
    msg.channel.send(this._formatHelp());
  }

  _formatHelp () {
    return '- `!trivia (n)`: Starts a round of `n` questions. If no number is provided, defaults to 1.\n- `what/who is/are/was`: Submits an answer.\n- `!trivia.help`: Displays commands.';
  }
}

module.exports = HelpCommand;
