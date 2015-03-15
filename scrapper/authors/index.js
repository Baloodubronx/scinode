var chalk = require('chalk');
var error = chalk.bold.red;
var info = chalk.bold.blue;

var async = require('async');
var Author = require('../../models/authors.model');
var Article = require('../../models/articles.model');


function restoreAuthors(cb) {
  var years = [2010, 2011, 2012, 2013, 2014];
  async.eachSeries(
    years,
    function(item, callback){
      console.log(info('restoring zeros on Authors for ' + item));
      Author.update({},
      {
        $push : {
          'citationsYear' : {
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


exports.cleanAuthors = function(cb) {
  console.log(info('Cleaning author.citationsYear'));
  Author.update({},
    {
      $set : {
        'citationsYear' : []
      }
    },
    {multi:true},
    function() {
      restoreAuthors(cb);
    }

  );
};

exports.cleanAuthorsPerYear = function(year, cb) {
  console.log(info('Cleaning author.citationsYear for '+year));
  Author.update({'citationsYear.year':year},
    {
      $set : {
        'citationsYear.$.ratio' : 0,
        'citationsYear.$.citedBy' : 0,
        'citationsYear.$.articleCount' : 0,
      }
    },
    {multi:true},
    cb
  );
};

exports.create = function(author, citations, year, callback) {
  Author.findOne({'fullName': author.fullName, 'citationsYear.year':year}, function(err, authorfound){
    if (err) return console.log(err);
    if (authorfound) {
      //console.log(authorfound);
      authorfound.citationsYear[year-2010].citedBy += citations;
      authorfound.citationsYear[year-2010].articleCount +=1;
      authorfound.citationsYear[year-2010].ratio = authorfound.citationsYear[year-2010].citedBy / authorfound.citationsYear[year-2010].articleCount;
      authorfound.save(function(){
        callback();
      });
    }
    else {
      var newAuthor  = new Author(author);
      for (var tempy = 2010; tempy < 2015; tempy++) {
        if (tempy===year) {
          newAuthor.citationsYear.push({year:tempy, articleCount:1, ratio:citations, citedBy:citations});
        }
        else {
          newAuthor.citationsYear.push({year:tempy, articleCount:0, ratio:0, citedBy:0});
        }
      }
      newAuthor.save(function(err){
        if (err) console.log(error(err));
        callback();
      });
    }
  });
};

exports.makeAuthorList = function(year, articount) {
  Article.findOne({'processedAuthors':false, 'journalInfo.yearOfPublication':year}, function(err, article){
    if (!article) {
			console.log('no more unprocessed articles FOR AUTHORS (year: '+year+')');
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

    async.eachSeries(
      article.authorList.author,
      function(item, callback) {
        exports.create(item, count, year, callback);
      },
      function(){
        Article.findOneAndUpdate({pmid:article.pmid}, {'processedAuthors':true}, function(){
          exports.makeAuthorList(year, articount);
        });
      }
    );
  });
};

exports.unprocessedCount = function(year, cb) {
  Article.count({'processedAuthors':false, 'journalInfo.yearOfPublication':year},
    function(err, count) {
      console.log(info("%s to be processed"), count);
      cb(count);
    }
  );
};
