'use strict';

function randomAnswerTemplate(name, serving) {

  const templates = [
    `How about ${name}? They have ${serving}`,
    `${name} does seems like a good choice if you want some good ${serving[0]}`,
  ];

  // eslint-disable-next-line
  return templates[Math.floor(Math.random() * (templates.length - 1)) + 0];
}

function constructPhrases(data) {
  return data.restaurants.map(restaurant => randomAnswerTemplate(restaurant.name, restaurant.serving));
}

module.exports = function (skill, info, bot, message) {

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

  const constructedPhrases = constructPhrases(seedData);

  bot.reply(message, constructedPhrases[Math.floor(Math.random() * (seedData.restaurants.length)) + 0]);
};
