'use strict';

const ChefBrain = require('./src/classes/ChefBrain');
const ChefEars = require('./src/classes/ChefEars');

const builtinPhrases = require('./builtin');

const SLACK_TOKEN = require('./.credential').token;
console.log(SLACK_TOKEN);
const Chef = {
  Brain: new ChefBrain(),
  Ears: new ChefEars(SLACK_TOKEN),
};

console.log('Chef is trying to remember the restaurants around');

Object.keys(builtinPhrases).forEach(key => Chef.Brain.teach(key, builtinPhrases[key]));
Chef.Brain.think();
console.log('Chef has remembered his choice, bring your questions...');

Chef.Ears
  .listen()
  .hear('.*', (speech, message) => {
    const interpretation = Chef.Brain.interpret(message.text);
    console.log(`Chef heard ${message.text}`);
    console.log(`Chef's interpretation ${interpretation}`);
    if (interpretation.guess) {
      console.log('Invoking skill: ', interpretation.guess);
      Chef.Brain.invoke(interpretation.guess, interpretation, speech, message);
    } else {
      speech.reply(message, 'Hmm... I don\'t have a response what you said... I\'ll save it and try to learn about it later.');
    }
  });
