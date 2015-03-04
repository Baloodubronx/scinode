/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

var http=require('http');
var async = require('async');
var _ = require('lodash');
var Article = require('../../../models/articles.model');
var journals = require('../../journals');

// Creates a new thing in the DB.
exports.create = function(articles, cb) {
  var nbinserted = 0, nbupdated=0;
  async.each(articles,
    function(item, callback){
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return done(err);
        if (!article) {
          var newArticle  = new Article(item);
          nbinserted ++;
          newArticle.save(callback);
        }
        else {
          nbupdated++;
          article.update(item, callback);
        }
      });
    },
    function(err) {
      console.log(nbinserted + ' saved, ' + nbupdated + ' updated');
      cb();
    }
    );
};

exports.check = function(articles, cb) {
  async.eachSeries(articles,
    function(item, callback){
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return err;
        if (!article) {
          exports.addArticle(item.pmid, function() {
            callback();
          });
        }
        else { callback();}
      });
    },
    cb
    );
};

exports.addArticle = function(pmid, cb) {
  var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	var str='';
	link += '&query='+pmid;
	var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			var json=JSON.parse(str);
      //console.log(json.resultList.result[0]);
			exports.create(json.resultList.result[0], function(){
				cb();
			});
		});

	});

	getRequest.on('error', function (err) {
    		console.log(err);
    		cb();
		});
};

exports.unsetProcessed = function(year, processedType) {
  var proc = {};
  switch (processedType) {
    case "processedJournal":
      proc = {processedJournal : false};
      break;
    case "processedKeywords":
      proc = {processedKeywords : false};
      break;
    case "processedAuthors":
      proc = {processedAuthors : false};
      break;
    default:
      proc = {processedJournal : false};
      break;
  }

  Article.update(
    {'journalInfo.yearOfPublication':year},
    {$set: proc},
    {upsert: false, "new": false, multi:true},
    function() {
      console.log(proc.stringify());
    }
  );
};
