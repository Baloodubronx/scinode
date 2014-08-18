'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var journalSchema = mongoose.Schema({
  title : String,
  medlineAbbreviation: String,
  essn : String,
  issn : String,
  isoabbreviation : String,
  nlmid: String 
} , { strict: false });

// methods ======================

module.exports = mongoose.model('Journal', journalSchema);
