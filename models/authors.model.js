var mongoose = require('mongoose');


var authorSchema = mongoose.Schema({
  fullName : {type:String, index : {unique: true}},
  firstName : String,
  lastName : String,
  initials: String,
  affiliation: String,

  citationsYear : [
    {
      year : {type:Number, index: { unique: false }},
      articleCount : {type:Number, default:1},
      ratio : {type:Number, default:0},
      citedBy : {type:Number, default:0}
    }
  ]
} , { strict: false });



authorSchema.index({ 'citationsYear.ratio': -1});
authorSchema.index({ 'fullName': 1, 'citationsYear.year': 1 });
module.exports = mongoose.model('Author', authorSchema);
