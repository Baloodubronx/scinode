var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
  processedKeywords : { type:Boolean, default:false, index:{unique:false, dropDups:false}},
  processedAuthors : { type:Boolean, default:false, index:{unique:false, dropDups:false}},
  processedJournal : { type:Boolean, default:false, index:{unique:false, dropDups:false}},

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
    yearOfPublication: {type:Number, index:{unique:false, dropDups:false}},
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
