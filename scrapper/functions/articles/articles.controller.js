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
  async.each(articles,
    function(item, callback){
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return done(err);
        if (!article) {
          var newArticle  = new Article(item);
          newArticle.save(function(err){
            callback();
          });
        }
        else { callback();}
      });
    },
    function(err) {
      cb();
    });
};

exports.check = function(articles, cb) {
  async.eachSeries(articles,
    function(item, callback){
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return done(err);
        if (!article) {
          exports.addArticle(item.pmid, function() {
            callback();
          });
        }
        else { callback();}
      });
    },
    function(err) {
      cb();
    });
};

exports.addArticle = function(pmid, cb) {
  var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	str='';
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
