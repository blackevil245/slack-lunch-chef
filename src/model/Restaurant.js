'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: {
    type: String,
  },
  serving: [String],
});

module.exports = mongoose.model('restaurant', RestaurantSchema);
