'use strict';

const Restaurant = require('../model/Restaurant');

module.exports = (skill, info, bot, message, Brain) => {

  const newRestaurant = {
    name: '',
    serving: [],
  };

  function askForDishes(convo) {
    convo.ask('What other dish do they have?', [
      {
        pattern: '^done$',
        callback: function (response, convo) {
          convo.say('Great, i will try to remember it!');
          const restaurant = new Restaurant();
          restaurant.name = newRestaurant.name;
          restaurant.serving = newRestaurant.serving;
          restaurant.save()
            .then(() => {
              convo.say('I now remember your new place :) Next time i may suggest it!');
              convo.next();
            })
            .catch(err => {
              convo.say('I\'m sorry something wrong has occured :( Would you might retype it?)!');
              convo.next();
            });
        },
      },
      {
        pattern: '.*',
        callback: function (response, convo) {
          newRestaurant.serving.push(response.text.toLowerCase());
          askForDishes(convo);
          convo.next();
        },
      },
    ]);
  }

  bot.startConversation(message, (err, convo) => {
    convo.ask('Nice! What is the place\' name?', [
      {
        pattern: '.*',
        callback: function (response, convo) {
          const placeName = response.text;
          newRestaurant.name = placeName;
          convo.say('Right, I\'ll call it `' + placeName + '`.');
          convo.ask('What dish are they having?', [
            {
              pattern: '.*',
              callback: function (response, convo) {
                newRestaurant.serving.push(response.text);
                askForDishes(convo);
                convo.next();
              },
            },
          ]);
          convo.next();
        },
      },
    ]);
  });
};
