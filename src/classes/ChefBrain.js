'use strict';

const NLP = require('natural');
const sentiment = require('sentiment');
const builtinPhrases = require('../seeds/phrase.seed.js');
const Phrase = require('../model/Phrase');

function toMaxValue(a, b) {
  return a && a.value > b.value ? a : b;
}

module.exports = class ChefBrain {

  constructor() {
    this.classifier = new NLP.LogisticRegressionClassifier();
    this.minConfidence = 0.8;
  }

  recall() {
    console.log('Chef is trying to recall the restaurants around');

    return Phrase.find()
      .then(dbPhrases => {
        Object.keys(builtinPhrases).forEach(key => {
          const dbPhrasesMatchingSkill = dbPhrases.filter(item => item.skill === key).map(item => item.phrase);
          this.teach(key, builtinPhrases[key].concat(dbPhrasesMatchingSkill));
        });

        this.think();
        console.log('Chef has recalled the restaurants, bring your questions...');
      })
      .catch(error => {
        return Promise.reject(error);
      });
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

  learnNewPhrase(skill, phrase) {
    console.log(`Chef will learn new phrase "${phrase}" for the skill ${skill}`);
    const newPhrase = new Phrase();
    newPhrase.skill = skill;
    newPhrase.phrase = phrase;
    return newPhrase.save()
      .then(() => {
        console.log(`Chef has learned new phrase for skill ${skill}`);
      })
      .catch(error => {
        return Promise.reject(error);
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

  detectBadWord(message) {
    const senti = sentiment(message.text);
    if (senti.score < 0) {
      console.log('\n\tSentiment value: ');
      console.dir(senti);
      console.log('\n');
    }
    return senti;
  }

  invoke(skill, info, bot, message) {
    let skillCode;

    console.log('Grabbing code for skill: ' + skill);

    try {
      skillCode = require('../skills/' + skill);
    } catch (err) {
      throw new Error(`The invoked skill ${skill} doesn\'t exist!`);
    }
    console.log('Running skill code for ' + skill + '...');
    skillCode(skill, info, bot, message, this);
  }

};
