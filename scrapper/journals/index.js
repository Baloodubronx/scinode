var async = require('async');
var _ = require('lodash');
var Journal = require('../../models/journals.model');
var Article = require('../../models/articles.model');


function updateCitation(jid, citations, year, callback) {
  Journal.findOneAndUpdate(
    {_id: journalId, "journalYears.year": year},
    { $inc: { "journalYears.$.count": 1 } },
    callback
  );
}

function restoreJournals() {
  var years = [2010, 2011, 2012, 2013, 2014];
  async.eachSeries(
    years,
    function(item, callback){
      console.log('updating ' + item);
      Journal.update({},
      {
        $push : {
          'journalYear' : {
            'year' : item,
            'articleCount' : 0,
            'ratio' : 0,
            'citedBy' : 0
          }
        }
      },
      {multi:true},
      callback
      );
    },
    function(err) {
      process.exit();
    }
  );
}


exports.cleanJournals = function() {
  Journal.update({},
    {
      $set : {
        'journalYear' : []
      }
    },
    {multi:true}, function(err) {
      console.log(err);
      restoreJournals();
    });
};

exports.create = function(journal, citations, year, callback) {
  Journal.findOne({'nlmid': journal.nlmid, 'journalYear.year':year}, function(err, journalfound){
    if (err) return console.log(err);
    if (journalfound) {
      journalfound.journalYear[year-2010].citedBy += citations;
      journalfound.journalYear[year-2010].articleCount +=1;
      journalfound.journalYear[year-2010].ratio = journalfound.journalYear[year-2010].citedBy / journalfound.journalYear[year-2010].articleCount;
      journalfound.save(function(){
        callback();
      });
    }
    else {
      var newJournal  = new Journal(journal);
      newJournal.journalYear = [
        {year:2010, articleCount:1, ratio:0, citedBy:0},
        {year:2011, articleCount:1, ratio:0, citedBy:0},
        {year:2012, articleCount:1, ratio:0, citedBy:0},
        {year:2013, articleCount:1, ratio:0, citedBy:0},
        {year:2014, articleCount:1, ratio:0, citedBy:0}
      ];
      newJournal.save(function(err){
        callback();
      });
    }
  });
};

exports.clean = function() {

};



exports.makeJournalList = function(year, articount) {
  var query = Article.findOne({'processedJournal':false, 'journalInfo.yearOfPublication':year}, function(err, article){
    if (!article) {
			console.log('no more unprocessed articles FOR JOURNALS (year: '+year+')');
			process.exit(code=1);
		}
    articount +=1;
    if (Math.floor(Math.random()*100)>95){
      console.log(articount);
    }

    var count = 0;
    if (article.citedByCount) {
      count = article.citedByCount;
    }

    exports.create(article.journalInfo.journal.toJSON(), count, year, function(){
      Article.findOneAndUpdate({pmid:article.pmid}, {'processedJournal':true}, function(err){
        exports.makeJournalList(year, articount);
      });
    });
  });
};
