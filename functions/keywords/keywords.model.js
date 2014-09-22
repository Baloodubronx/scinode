'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var keywordSchema = mongoose.Schema({
  keyword : {type:String, index :{unique:true, dropDups:true}},
  count : Number
});

// methods ======================
//mongoose.set('debug', true);

module.exports = mongoose.model('Keyword', keywordSchema);
