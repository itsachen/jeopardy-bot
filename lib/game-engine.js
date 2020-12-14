'use strict';

const Bluebird = require('bluebird');
const Mutex    = require('async-mutex').Mutex;

const AnswerComparison  = require('./answer-comparison');
const Config            = require('../config');
const DiscordFormatting = require('./utils/discord-formatting');
const HintEngine        = require('./hint-engine');
const JService          = require('./libraries/jservice');
const Logger            = require('./libraries/logger');
const Scoreboard        = require('./stores/scoreboard');
const Stats             = require('./stores/stats');
const StringUtils       = require('./utils/string-utils');

class GameEngine {
  constructor ({ debug }) {
    this.debug = debug === undefined ? false : debug;

    this.numQuestionsRemaining = 0;

    this.currentQuestion = null;

    this.hintTimeout = null;
    this.questionTimeout = null;

    this.mutex = new Mutex();
  }

  //============================================================================
  // Public Methods
  //============================================================================

  async startRound (numQuestions, channel) {
    const releaseMutex = await this.mutex.acquire();

    if (this.questionBeingAsked()) {
      Logger.info('GameEngine.startRound - exiting because question is being asked');
      releaseMutex();
      return;
    }

    if (this.debug) {
      Logger.info({ msg: 'GameEngine.startRound', numQuestions });
    }
    this.numQuestionsRemaining = numQuestions;

    await this._sendQuestion(channel);
    releaseMutex();
  }

  async stopRound () {
    const releaseMutex = await this.mutex.acquire();

    if (!this.questionBeingAsked()) {
      Logger.info('GameEngine.stopRound - exiting because question is not being asked');
      releaseMutex();
      return;
    }

    if (this.debug) {
      Logger.info('GameEngine.stopRound - stopping round');
    }

    this._clearTimeouts();
    this._clearCurrentQuestion();

    releaseMutex();
  }

  async attemptAnswer (rawGuess, msg) {
    // Record the time for stats
    const timeAtAnswer = Date.now();

    const user = msg.author;

    const releaseMutex = await this.mutex.acquire();

    if (!this.questionBeingAsked()) {
      Logger.info('GameEngine.attemptAnswer - exiting because question not being asked');
      releaseMutex();
      return;
    }

    if (msg.createdTimestamp < this.currentQuestion.fetchedAt) {
      Logger.info('GameEngine.attemptAnswer - exiting because answer is older than current question');
      releaseMutex();
      return;
    }

    if (this.debug) {
      Logger.info({ msg: 'GameEngine.attemptAnswer', rawGuess });
    }

    if (AnswerComparison.compare(rawGuess, this.currentQuestion.answer)) {
      this._clearTimeouts();

      await Scoreboard.increaseScore(user, this.currentQuestion.value);
      const newScore = await Scoreboard.getScore(user);

      await Stats.incrCorrectStat(user);
      await Stats.recordAnswerAndTime(user, this.currentQuestion.answer, timeAtAnswer - this.currentQuestion.fetchedAt);

      msg.channel.send(this._formatCorrectAnswer({ answer: this.currentQuestion.answer, user, newScore }));

      await this._finishQuestion(msg.channel);
      releaseMutex();
    } else {
      // Decrease score by half the question's value on incorrect guess
      await Scoreboard.decreaseScore(user, this.currentQuestion.value / 2);
      const newScore = await Scoreboard.getScore(user);

      await Stats.incrIncorrectStat(user);

      msg.channel.send(this._formatIncorrectAnswer({ user, newScore }));
      releaseMutex();
    }
  }

  async skipCurrentQuestion (commandTimestamp, channel) {
    const releaseMutex = await this.mutex.acquire();

    if (!this.questionBeingAsked()) {
      Logger.info('GameEngine.skipCurrentQuestion - exiting because question not being asked');
      releaseMutex();
      return;
    }

    if (commandTimestamp < this.currentQuestion.fetchedAt) {
      Logger.info('GameEngine.skipCurrentQuestion - exiting because command is older than current question');
      releaseMutex();
      return;
    }

    await this._skipCurrentQuestion(channel);
    releaseMutex();
  }

  questionBeingAsked () {
    return this.currentQuestion !== null;
  }

  //============================================================================
  // Private Methods
  //============================================================================

  async _sendQuestion (channel) {
    // Fetch question from jservice.io
    const question = await JService.random();

    this.currentQuestion = {
      id: question.id, // jservice ID
      question: question.question,
      answer: question.answer,
      value: question.value,
      category: question.category.title,
      fetchedAt: Date.now(),
    };

    // Emit question
    channel.send(this._formatQuestion(this.currentQuestion));

    if (this.debug) {
      Logger.info(this.currentQuestion);
    }

    this.hintTimeout = setTimeout(() => {
      const hint = HintEngine.generateHint(this.currentQuestion.answer);
      channel.send(this._formatHintTimeout(hint));
    }, Config.HINT_TIMEOUT_MS);

    this.questionTimeout = setTimeout(async () => {
      const releaseMutex = await this.mutex.acquire();

      channel.send(this._formatQuestionTimeout(this.currentQuestion));
      this._finishQuestion(channel);

      releaseMutex();
    }, Config.QUESTION_TIMEOUT_MS);
  }

  async _finishQuestion (channel) {
    this.numQuestionsRemaining -= 1;

    if (this.numQuestionsRemaining > 0) {
      await Bluebird.delay(Config.BETWEEN_QUESTION_DELAY_MS);
      await this._sendQuestion(channel);
    } else {
      this._clearCurrentQuestion();
    }
  }

  async _skipCurrentQuestion (channel) {
    this._clearTimeouts();
    channel.send(this._formatSkipped(this.currentQuestion));
    await this._finishQuestion(channel);
  }

  _clearTimeouts () {
    clearTimeout(this.hintTimeout);
    clearTimeout(this.questionTimeout);
  }

  _clearCurrentQuestion () {
    this.currentQuestion = null;
  }

  //============================================================================
  // Message Formatters
  //============================================================================

  _formatQuestion ({ question, category, value }) {
    return `${DiscordFormatting.bold(category.toUpperCase())} for ${StringUtils.formatMoney(value)}:\n${DiscordFormatting.multilineCodeBlock(question)}`;
  }

  _formatHintTimeout (hint) {
    return `Hint: ${hint}`;
  }

  _formatQuestionTimeout ({ answer }) {
    return `Time's up! The correct answer was ${DiscordFormatting.bold(answer)}.`;
  }

  _formatSkipped ({ answer }) {
    return `The correct answer was ${DiscordFormatting.bold(answer)}.`;
  }

  _formatCorrectAnswer ({ answer, user, newScore }) {
    return `${DiscordFormatting.bold(StringUtils.capitalize(answer))} is correct, ${user}. Your score is now ${StringUtils.formatMoney(newScore)}.`;
  }

  _formatIncorrectAnswer ({ user, newScore }) {
    return `That is incorrect, ${user}. Your score is now ${StringUtils.formatMoney(newScore)}.`;
  }
}

module.exports = GameEngine;
