'use strict';

const Bluebird = require('bluebird');

const AnswerComparison  = require('./answer-comparison');
const Config            = require('../config');
const DiscordFormatting = require('./utils/discord-formatting');
const HintEngine        = require('./hint-engine');
const JService          = require('./libraries/jservice');
const Logger            = require('./libraries/logger');
const Scoreboard        = require('./scoreboard');
const StringUtils       = require('./utils/string-utils');

class GameEngine {
  constructor ({ debug }) {
    this.debug = debug === undefined ? false : debug;

    this.numQuestionsRemaining = 0;

    this.currentQuestion = null;

    this.hintTimeout = null;
    this.questionTimeout = null;
  }

  //============================================================================
  // Public Methods
  //============================================================================

  async startRound (numQuestions, channel) {
    if (this.debug) {
      Logger.info('Round started', numQuestions);
    }
    this.numQuestionsRemaining = numQuestions;

    await this._sendQuestion(channel);
  }

  async attemptAnswer (rawGuess, msg) {
    if (this.debug) {
      Logger.info({ msg: 'GameEngine.attemptAnswer', rawGuess });
    }

    if (AnswerComparison.compare(rawGuess, this.currentQuestion.answer)) {
      await Scoreboard.increaseScore(msg.author, this.currentQuestion.value);
      const newScore = await Scoreboard.getScore(msg.author);

      msg.channel.send(this._formatCorrectAnswer({ answer: this.currentQuestion.answer, user: msg.author, newScore }));

      this._skipCurrentQuestion(msg.channel);
    } else {
      msg.channel.send(this._formatIncorrectAnswer({ user: msg.author }));
    }
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
      question: question.question,
      answer: question.answer,
      value: question.value,
      category: question.category.title,
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
      channel.send(this._formatQuestionTimeout(this.currentQuestion));
      this._finishQuestion(channel);
    }, Config.QUESTION_TIMEOUT_MS);
  }

  async _finishQuestion (channel) {
    this.numQuestionsRemaining -= 1;

    if (this.numQuestionsRemaining > 0) {
      await Bluebird.delay(Config.BETWEEN_QUESTION_DELAY_MS);
      this._sendQuestion(channel);
    } else {
      this.currentQuestion = null;
      this._clearCurrentQuestion();
    }
  }

  _skipCurrentQuestion (channel) {
    this._clearTimeouts();
    this._finishQuestion(channel);
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
    return `${DiscordFormatting.bold(category.toUpperCase())} for $${value}:\n${DiscordFormatting.multilineCodeBlock(question)}`;
  }

  _formatHintTimeout (hint) {
    return `Hint: ${hint}`;
  }

  _formatQuestionTimeout ({ answer }) {
    return `Time's up! The correct answer was ${DiscordFormatting.bold(answer)}.`;
  }

  _formatCorrectAnswer ({ answer, user, newScore }) {
    return `${DiscordFormatting.bold(StringUtils.capitalize(answer))} is correct, ${user}. Your score is now $${newScore}.`;
  }

  _formatIncorrectAnswer ({ user }) {
    return `That is incorrect, ${user}.`;
  }
}

module.exports = GameEngine;
