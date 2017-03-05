'use strict';

const Restaurant = require('../model/Restaurant');

function randomAnswerTemplate(name, serving) {

  const templates = [
    `How about ${name}? They have ${serving}`,
    `${name} does seems like a good choice if you want some good ${serving[0]}`,
  ];

  // eslint-disable-next-line
  return templates[Math.floor(Math.random() * templates.length)];
}

function constructPhrases(data) {
  return data.restaurants.map(restaurant => randomAnswerTemplate(restaurant.name, restaurant.serving));
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

module.exports = (skill, info, bot, message, Brain) => {

  const seedData = {
    restaurants: [
      {
        name: 'Skiffer',
        serving: ['pizza', 'salad'],
      },
      {
        name: 'Manhattan steak house',
        serving: ['steak', 'pork'],
      },
      {
        name: 'Samrat',
        serving: ['curry'],
      },
    ],
  };

  retrieveAllRestaurant()
    .then(restaurants => {
      seedData.restaurants = seedData.restaurants.concat(restaurants);
      return seedData;
    })
    .then(withSeedData => {
      const constructedPhrases = constructPhrases(withSeedData);
      bot.reply(message, constructedPhrases[Math.floor(Math.random() * withSeedData.restaurants.length)]);
    });
};
