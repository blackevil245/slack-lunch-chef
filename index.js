'use strict';

const mongoose = require('mongoose');
const ChefBrain = require('./src/classes/ChefBrain');
const ChefEars = require('./src/classes/ChefEars');
const dbConfig = require('./src/config/db');

const SLACK_TOKEN = require('./.credential').token;

const Chef = {
  Brain: new ChefBrain(),
  Ears: new ChefEars(SLACK_TOKEN),
};

// Connect mongoose to Database
mongoose.connect(dbConfig.connectionUrl);

Chef.Ears
  .listen()
  .hear('.*', (speech, message) => {
    const interpretation = Chef.Brain.interpret(message.text);
    console.log(`Chef heard ${message.text}`);
    console.log(`Chef's interpretation ${interpretation}`);
    if (interpretation.guess) {
      console.log('Invoking skill: ', interpretation.guess);
      Chef.Brain.invoke(interpretation.guess, interpretation, speech, message, Chef.Brain);
    } else {
      speech.reply(message, 'Hmm... I don\'t have a response what you said... I\'ll save it and try to learn about it later.');
    }
  });
