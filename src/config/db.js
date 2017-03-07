'use strict';

const DB_NAME = 'BOT_CHEF';

module.exports = {
  connectionUrl: process.env.OPENSHIFT_MONGODB_DB_URL + DB_NAME || 'mongodb://localhost:27017/' + DB_NAME,
};
