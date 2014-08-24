'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
  pmid  : { type: Number , index: { unique: true, dropDups: true }},
  title           : String,
  journal         : String,
  journalName: String,
  day: Number,
  month: Number,
  year: Number,
  theabstract: String,
  authors: String,
  hindex: Number
} , { strict: false });

// methods ======================

module.exports = mongoose.model('Article', articleSchema);
