const mongoose = require('mongoose');

const configkeys = require('../config/keys');

async function dbConnection(){
  try {
    await mongoose.connect(configkeys.mongoDBURL, {useNewUrlParser: true});
    console.log('MongoDB is connected')
  } catch (err) {
    console.log(err);
  }
}

module.exports = dbConnection;
