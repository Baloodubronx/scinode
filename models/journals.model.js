var mongoose = require('mongoose');


var journalSchema = mongoose.Schema({
  title : String,
  medlineAbbreviation: String,
  essn : String,
  issn : String,
  isoabbreviation : String,
  nlmid: {type:String, index: { unique: true, dropDups: true }},
  citedBy : {type:Number, default:0}
} , { strict: false });


module.exports = mongoose.model('Journal', journalSchema);