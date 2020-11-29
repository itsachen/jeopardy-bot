'use strict';

class BaseCommand {
  constructor ({ gameEngine, debug }) {
    this.gameEngine = gameEngine;
    this.debug = debug === undefined ? false : debug;
  }

  messageMatcher (_msg) {
    throw '`messageMatcher` must be implemented.';
  }

  async handleMessage (_msg) {
    throw '`handleMessage` must be implemented.';
  }
}

module.exports = BaseCommand;
