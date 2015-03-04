var chalk = require('chalk');
var error = chalk.bold.red;
var info = chalk.bold.blue;

var async = require('async');
var Journal = require('../../models/journals.model');
var Article = require('../../models/articles.model');


function updateCitation(jid, citations, year, callback) {
  Journal.findOneAndUpdate(
    {_id: journalId, "journalYears.year": year},
    { $inc: { "journalYears.$.count": 1 } },
    callback
  );
}

function restoreJournals(cb) {
  var years = [2010, 2011, 2012, 2013, 2014];
  async.eachSeries(
    years,
    function(item, callback){
      console.log('restoring zeros for ' + item);
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
    cb
  );
}


exports.cleanJournals = function(cb) {
  console.log('Cleaning journal.journalYear');
  Journal.update({},
    {
      $set : {
        'journalYear' : []
      }
    },
    {multi:true}, function() {
      restoreJournals(cb);
    }

  );
};

exports.cleanJournalsPerYear = function(year, cb) {
  console.log('Cleaning journal.journalYear for '+year);
  Journal.update({'journalYear.year':year},
    {
      $set : {
        'journalYear.$.ratio' : 0,
        'journalYear.$.citedBy' : 0,
        'journalYear.$.articleCount' : 0,
      }
    },
    {multi:true},
    cb
  );
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

exports.makeJournalList = function(year, articount) {
  Article.findOne({'processedJournal':false, 'journalInfo.yearOfPublication':year}, function(err, article){
    if (!article) {
			console.log('no more unprocessed articles FOR JOURNALS (year: '+year+')');
			process.exit();
		}
    articount +=-1;
    if (Math.floor(Math.random()*100)>95){
      console.log(articount);
    }

    var count = 0;
    if (article.citedByCount) {
      count = article.citedByCount;
    }

    exports.create(article.journalInfo.journal.toJSON(), count, year, function(){
      Article.findOneAndUpdate({pmid:article.pmid}, {'processedJournal':true}, function(){
        exports.makeJournalList(year, articount);
      });
    });
  });
};

exports.unprocessedCount = function(year, cb) {
  var error = chalk.bold.green;
  Article.count({'processedJournal':false, 'journalInfo.yearOfPublication':year},
    function(err, count) {
      console.log(info("%s to be processed"), count);
      cb(count);
    }
  );
};
