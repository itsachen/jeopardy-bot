'use strict';

const Discord = require('discord.js');

const Logger     = require('./libraries/logger');
const GameEngine = require('./game-engine');

const AnswerCommand = require('./commands/answer-command');
const HelpCommand   = require('./commands/help-command');
const ResetCommand  = require('./commands/reset-command');
const TriviaCommand = require('./commands/trivia-command');

class Bot {
  constructor ({ token, debug }) {
    this.token = token;
    this.debug = debug === undefined ? false : debug;
    this.gameEngine = new GameEngine({ debug });

    this._initializeCommands();
  }

  start () {
    this.bot = new Discord.Client();
    this._login();
    this._registerHandlers();
  }

  _login () {
    if (!this.bot) {
      return;
    }

    this.bot.login(this.token);
  }

  _initializeCommands () {
    const defaultCommandArgs = { gameEngine: this.gameEngine, debug: this.debug };

    // Order determines command priority
    this.commands = [
      new TriviaCommand(defaultCommandArgs),
      new AnswerCommand(defaultCommandArgs),
      new ResetCommand(defaultCommandArgs),
      new HelpCommand(defaultCommandArgs),
    ];
  }

  _registerHandlers () {
    if (!this.bot) {
      return;
    }

    this.bot.on('ready', this._onReady.bind(this));
    this.bot.on('message', async (msg) => {
      await this._onMessage(msg);
    });
  }

  // Handlers

  _onReady () {
    Logger.info(`Logged in as ${this.bot.user.tag}!`);
  }

  async _onMessage (msg) {
    for (const command of this.commands) {
      if (command.messageMatcher(msg)) {
        await command.handleMessage(msg);
        break;
      }
    }
  }
}

module.exports = Bot;
