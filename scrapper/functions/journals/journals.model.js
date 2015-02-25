'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var journalSchema = mongoose.Schema({
  title : String,
  medlineAbbreviation: String,
  essn : String,
  issn : String,
  isoabbreviation : String,
  nlmid: {type:String, index: { unique: true, dropDups: true }}
} , { strict: false });

// methods ======================
//mongoose.set('debug', true);

module.exports = mongoose.model('Journal', journalSchema);
