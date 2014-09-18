'use strict';

var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
  processed : { type:Boolean, default:false, index:true },
  pmid  : { type: Number, index: {unique: true, dropDups: true}},
  title : String,
  authorString: String,
  authorList: { 
    author: [
      {
        fullName : String,
        firstName : String,
        lastName : String,
        initials: String,
        affiliation: String
      }
    ]
  },
  journalInfo: {
    issue: String,
    volume: String,
    monthOfPublication: Number,
    yearOfPublication: Number,
    journal: {
      title: String,
      isoabbreviation: String,
      nlmid: String
    }
  },
  pageInfo : String,
  abstractText: String,
  affiliation: String,
  isOpenAccess: String,
  citedByCount: Number,
  doi: String,
  luceneScore: String
} , { strict: true });

// methods ======================

module.exports = mongoose.model('Article', articleSchema);









