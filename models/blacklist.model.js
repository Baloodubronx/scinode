'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var blacklistSchema = mongoose.Schema({
  keyword : {type:String, index :{unique:true, dropDups:true}},
});

// methods ======================
//mongoose.set('debug', true);

module.exports = mongoose.model('Blacklist', blacklistSchema);
