'use strict';

const mongoose = require('mongoose');
const ChefBrain = require('./src/classes/ChefBrain');
const ChefEars = require('./src/classes/ChefEars');
const dbConfig = require('./src/config/db');

const SLACK_TOKEN = process.env.SLACK_TOKEN;

const Chef = {
  Brain: new ChefBrain(),
  Ears: new ChefEars(SLACK_TOKEN),
};

// Connect mongoose to Database
mongoose.connect(dbConfig.connectionUrl);
mongoose.Promise = require('bluebird');

Chef.Brain.recall()
  .then(done => {
    Chef.Ears
      .listen()
      .hear('.*', (speech, message) => {
        const interpretation = Chef.Brain.interpret(message.text);

        if (Chef.Brain.detectBadWord(message) < 0) {
          speech.reply('Using bad words will be a very bad habit!');
        } else if (interpretation.guess) {
          console.log(`Chef heard ${message.text}`);
          console.log(`Chef's interpretation ${JSON.stringify(interpretation)}`);
          console.log('Invoking skill: ', interpretation.guess);

          if (Chef.Brain.detectBadWord(message) < 0) {
            speech.reply('Using bad words will be a very bad habit!');
          } else {
            Chef.Brain.invoke(interpretation.guess, interpretation, speech, message);
            Chef.Brain.learnNewPhrase(interpretation.guess, message.text);
          }
        } else {
          speech.reply(message, 'Hmm... I don\'t have a response what you said... I\'ll save it and try to learn about it later.');
        }
      });
  })
  .catch(error => {
    console.log(error.stack);
    throw new Error(error);
  });
