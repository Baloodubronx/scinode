var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
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
  luceneScore: String,

  keywordList: {
    keyword: [ String ]
  },

  processedKeywords : { type:Boolean, default:false, index:{unique:false, dropDups:false}},
  processedAuthors : { type:Boolean, default:false, index:{unique:false, dropDups:false}},
  processedJournal : { type:Boolean, default:false, index:{unique:false, dropDups:false}}

} , { strict: false });

// INDEXES

articleSchema.index({ 'journalInfo.yearOfPublication': 1, 'processedAuthors': 1 });
articleSchema.index({ 'journalInfo.yearOfPublication': 1, 'processedKeywords': 1 });
articleSchema.index({ 'journalInfo.yearOfPublication': 1, 'processedJournal': 1 });

module.exports = mongoose.model('Article', articleSchema);
