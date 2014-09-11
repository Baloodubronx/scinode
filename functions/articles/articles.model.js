'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
  pmid  : { type: Number , index: { unique: true, dropDups: true }},
  authorList: { author: Array },
  authorString: String,
  hindex: Number
} , { strict: false });

// methods ======================

module.exports = mongoose.model('Article', articleSchema);
