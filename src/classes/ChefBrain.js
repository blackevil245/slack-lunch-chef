'use strict';

const NLP = require('natural');
const sentiment = require('sentiment');

function toMaxValue(a, b) {
  return a && a.value > b.value ? a : b;
}

module.exports = class ChefBrain {

  constructor() {
    this.classifier = new NLP.LogisticRegressionClassifier();
    this.minConfidence = 0.7;
  }

  teach(label, phrases) {
    phrases.forEach(phrase => {
      console.info(`Ingesting example for ${label} : ${phrase}`);
      this.classifier.addDocument(phrase.toLowerCase(), label);
    });
  }

  think() {
    this.classifier.train();

    // save the classifier for later use
    const aPath = './src/classes/classifier.json';

    this.classifier.save(aPath, (err, classifier) => {
    // the classifier is saved to the classifier.json file!
      console.log('Writing: Creating a Classifier file in SRC.');
    });
  }

  interpret(phrase) {
    const guesses = this.classifier.getClassifications(phrase.toLowerCase());
    const guess = guesses.reduce(toMaxValue);
    return {
      probabilities: guesses,
      guess: guess.value > this.minConfidence ? guess.label : null,
    };
  }

  invoke(skill, info, bot, message) {
    let skillCode;
    const senti = sentiment(message.text);
    if (senti.score !== 0) {
      console.log('\n\tSentiment value: ');
      console.dir(senti);
      console.log('\n');
    }

    console.log('Grabbing code for skill: ' + skill);

    try {
      skillCode = require('../skills/' + skill);
    } catch (err) {
      throw new Error(`The invoked skill ${skill} doesn\'t exist!`);
    }
    console.log('Running skill code for ' + skill + '...');
    skillCode(skill, info, bot, message, senti);
  }

};
