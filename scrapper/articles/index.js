// SCRAPPER ARTICLES FUNCTIONS
/*

  create(articles, cb)  : save/update article in DB from each item in articles
  check(articles, cb)   : verify if each article already exist in db, if not addArticle
  addArticle(pmid, cb)  : add a single article to DB from the PMID
  scrap(year, page)     : get articles for a year + page, then create()
  checkPMIDs(year, page): just checkin'
  unsetProcessed(year, processedType) : self-explenatory

*/

'use strict';

var http=require('http');
var async = require('async');
var Article = require('../../models/articles.model');


exports.create = function(articles, cb) {
  var nbinserted = 0, nbupdated=0;
  async.each(articles,
    function(item, callback){
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return err;
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
    function() {
      if (articles.length) console.log(nbinserted + ' saved, ' + nbupdated + ' updated');
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
            console.log('I just added a missing article');
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
			exports.create(json.resultList.result[0], cb);
		});

	});

	getRequest.on('error', function (err) {
		console.log(err);
		cb();
	});
};

exports.scrap = function(year, page) {
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	var str='';
	link += '&query=PUB_YEAR:'+year+'&page='+page;
	console.log(link);
	var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			var json=JSON.parse(str);
			exports.create(json.resultList.result, function(){
				exports.scrap(year, ++page);
			});
		});

	});

	getRequest.on('error', function (err) {
		console.log(err);
		exports.scrap(year, page);
	});
};


exports.checkPMIDs = function(year, page) {
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=idlist';
	var str='';
	link += '&query=PUB_YEAR:'+year+'&page='+page;
	console.log(link);

  var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			var json=JSON.parse(str);
			exports.check(json.resultList.result, function(){
				exports.checkPMIDs(year, ++page);
			});
		});

	});

	getRequest.on('error', function (err) {
		console.log(err);
		exports.checkPMIDs(year, page);
	});
};

exports.unsetProcessed = function(year, processedType, cb) {
  console.log('Unprocessing '+processedType + ' for year ' + year + ' (it may take some time)');

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
      break;
  }

  Article.update(
    {'journalInfo.yearOfPublication':year},
    {$set: proc},
    {upsert: false, "new": false, multi:true},
    cb
  );
};
