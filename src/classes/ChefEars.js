'use strict';

const BotKit = require('botkit');

const Bot = BotKit.slackbot({
  debug: true,
  storage: undefined,
});

module.exports = class ChefEar {

  constructor(token) {
    this.scopes = [
      'direct_mention',
      'direct_message',
      'mention',
    ];
    this.token = token;
  }

  listen() {
    console.log('Chef is listening for your requests');
    this.bot = Bot.spawn({
      token: this.token,
    }).startRTM();
    return this;
  }

  hear(pattern, cb) {
    console.log('Chef heard you');
    Bot.hears(pattern, this.scopes, cb);
  }

};
