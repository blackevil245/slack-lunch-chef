'use strict';

const Restaurant = require('../model/Restaurant');

module.exports = (skill, info, bot, message, Brain) => {

  const newRestaurant = {
    name: '',
    serving: [],
  };

  function askForDishes(convo) {
    convo.ask('What dish do they have?', [
      {
        pattern: '^done$',
        callback: function (response, convo) {
          convo.say('Great, i will try to remember it!');
          const restaurant = new Restaurant();
          restaurant.name = newRestaurant.name;
          restaurant.serving = newRestaurant.serving;
          restaurant.save(err => {
            if (err) throw Error(err);
            convo.next();
          });
        },
      },
      {
        pattern: '.*',
        callback: function (response, convo) {
          newRestaurant.serving.push(response.text);
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
