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



exports.makeJournalList = function() {
  var query = Article.findOne({'processedJournal':false}, function(err, article){
    if (!article) {
			console.log('no more unprocessed articles FOR JOURNALS');
			process.exit(code=1);
		}
    if (Math.floor(Math.random()*10)>8){
      Article.find({'processedJournal':false}).count(function(err, count) {
        console.log(count);
      });
    }
    var count = 0;
    if (article.citedByCount) {
      count = article.citedByCount;
    }
    exports.create(article.journalInfo.journal.toJSON(), count, function(){
      article.processedJournal=true;
      article.save(function() {
        exports.makeJournalList();
      });
    });
  });
};
