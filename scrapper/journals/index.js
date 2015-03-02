var _ = require('lodash');
var Journal = require('../../models/journals.model');
var Article = require('../../models/articles.model');

// Creates a new thing in the DB.
exports.create = function(journal, citations, callback) {
  Journal.findOne({'nlmid': journal.nlmid}, function(err, journalfound){
    if (err) return console.log(err);
    if (journalfound) {
      journalfound.citedBy += citations;
      journalfound.save(function(){
        callback();
      });
    }
    else {
      var newJournal  = new Journal(journal);
      newJournal.save(function(err){
        callback();
      });
    }
  });
};

exports.clean = function() {

};



exports.makeJournalList = function(year) {
  console.time('find a suitable article');
  var query = Article.findOne({'processedJournal':false, 'journalInfo.yearOfPublication':year}, function(err, article){
    console.timeEnd('find a suitable article');
    if (!article) {
			console.log('no more unprocessed articles FOR JOURNALS (year: '+year+')');
			process.exit(code=1);
		}
    console.time('the math thingy');
    if (Math.floor(Math.random()*10)>8){
      Article.find({'processedJournal':false, 'journalInfo.yearOfPublication':year}).count(function(err, count) {
        console.log(count+' more to do in '+year);
      });
    }
    console.timeEnd('the math thingy');
    var count = 0;
    if (article.citedByCount) {
      count = article.citedByCount;
    }
    console.time('create journal from infos');
    exports.create(article.journalInfo.journal.toJSON(), count, function(){
      console.timeEnd('create journal from infos');
      article.processedJournal=true;
      console.time('save article');
      article.save(function() {
        console.timeEnd('save article');
        exports.makeJournalList(year);
      });
    });
  });
};
