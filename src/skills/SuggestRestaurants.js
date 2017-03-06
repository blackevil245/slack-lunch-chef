'use strict';

const Restaurant = require('../model/Restaurant');
const NLP = require('natural');
const _ = require('lodash');
const tokenizer = new NLP.WordTokenizer();

function randomAnswerTemplate(name, serving) {
  const templates = [
    `How about ${name}? They have ${serving}`,
    `${name} does seems like a good choice if you want good ${serving[0]}`,
  ];

  // eslint-disable-next-line
  return templates[Math.floor(Math.random() * templates.length)];
}

function constructPhrases(restaurants) {
  return restaurants.map(restaurant => randomAnswerTemplate(restaurant.name, restaurant.serving));
}

function retrieveAllRestaurant() {
  return new Promise((resolve, reject) => {
    Restaurant.find((err, restaurants) => {
      if (err) {
        reject(err);
      }
      resolve(restaurants);
    });
  });
}

function filterRestaurantByMessage(restaurants, message) {

  const tokenizedText = tokenizer.tokenize(message.text);

  const restaurantDishes = _.uniqWith(restaurants.reduce((accumulator, current) => {
    return accumulator.concat(current.serving);
  }, []), _.isEqual);

  // Find possible dishes in text by filtering out unlikely one, sort the most likely and get the first option
  const dishesFoundInMessage = tokenizedText
    .filter(text => restaurantDishes.some(dish => NLP.JaroWinklerDistance(dish, text) > 0.9)) // eslint-disable-line

  if (dishesFoundInMessage.length === 0) {
    return restaurants;
  }

  return restaurants.filter(restaurant => {
    // eslint-disable-next-line
    return dishesFoundInMessage.some(dish => restaurant.serving.some(serving => NLP.JaroWinklerDistance(serving, dish) > 0.9));
  });
}

module.exports = (skill, info, bot, message, Brain) => {

  const seedData = {
    restaurants: require('../seeds/restaurant.seed.js'),
  };

  retrieveAllRestaurant()
    .then(restaurants => {
      seedData.restaurants = seedData.restaurants.concat(restaurants);
      return seedData;
    })
    .then(({ restaurants }) => {
      const filteredRestaurants = filterRestaurantByMessage(restaurants, message);
      const constructedPhrases = constructPhrases(filteredRestaurants);
      bot.reply(message, constructedPhrases[Math.floor(Math.random() * filteredRestaurants.length)]);
    });
};
