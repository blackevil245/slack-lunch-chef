'use strict';

const greetingPhrases = [
  'Hello',
  'What’s up!',
  'Good to see you!',
  'Pleased to meet you!',
  'G’day mate!',
];

function randomGreeting() {
  return greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)];
}

module.exports = (skill, info, bot, message, Brain) => {
  bot.reply(message, randomGreeting());
};
