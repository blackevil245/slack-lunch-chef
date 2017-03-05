'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhraseSchema = new Schema({
  skill: {
    type: String,
  },
  phrase: {
    type: String,
  },
});

module.exports = mongoose.model('phrase', PhraseSchema);
