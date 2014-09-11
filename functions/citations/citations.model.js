'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var citationsSchema = mongoose.Schema({
  nlmid: {type:String, index: { unique: true, dropDups: true }},
  citedBy : Number
});

// methods ======================
//mongoose.set('debug', true);

module.exports = mongoose.model('Citations', citationsSchema);