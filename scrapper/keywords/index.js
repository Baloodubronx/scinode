// KEYWORDS list generation in Scrapper
/*
	Functions list:

		makelist()	: 	Make the list of keywords

*/

'use strict';

var chalk = require('chalk');
var error = chalk.bold.red;
var info = chalk.bold.blue;
var async=require('async');
var _ = require('lodash');

var Keyword   = require('../../models/keywords.model');
var Blacklist = require('../../models/blacklist.model');
var Whitelist = require('../../models/whitelist.model');
var Article 	= require('../../models/articles.model');


exports.reset = function(cb) {
	console.log(info('resetting whitelist counts'));
	Whitelist.update({}, {'count':0}, function(){
		console.log(info('cleaning keywords list'));
		Keyword.remove(cb);
	});
};


exports.makelist = function () {
	console.time('One article');
	Article.findOne({'journalInfo.yearOfPublication':2014, 'processedKeywords':false} , function(err, article){
		if (!article) {
			console.log('no more unprocessed articles');
			process.exit();
		}
		console.log(article.pmid);

		// MAKE THE ARRAY OF KEYWORDS; PREFERENCE FOR 3 WORDS, THEN 2 WORDS, THEN 1 WORD
		var str = article.abstractText + ' ' + article.title;
		var temparray1 = str.toLowerCase().match(/\w+/g);
		var temparray2 = str.toLowerCase().match(/\w+\s\w+/g);
		var temparray3 = str.toLowerCase().match(/\w+\s\w+\s\w+/g);

		var finalarray = temparray1.concat(temparray2).concat(temparray2).concat(temparray3).concat(temparray3).concat(temparray3);
		finalarray = _.difference(finalarray, ['']);

		async.each(finalarray,
		  function(term, callback){
				if (term==='') callback();

				async.waterfall([
					// CHECK IF IN BL
					function(done) {
						Blacklist.findOne({'keyword': term}, function(err, bl){
							if (err) console.log(err);
							if (bl) {
								done(null, true);
							}
							else done(null, false);
						});
					},

					// CHECK IF IN WL
					function(pass, done) {
						if (pass) done(null, true);
						else {
						Whitelist.findOne({'keyword': term}, function(err, wl){
							if (err) console.log(err);
							if (wl) {
								wl.count += 1;
								wl.save(function() {
									done(null, true);
								});
							}
							else done(null, false);
						});
						}
					},

					// ELSE ADD TO KEYWORDS
					function(pass, done) {
						if (pass) done(null);
						else {
						Keyword.findOne({'keyword':term}, function(err, keyword){
				    	if (keyword) {
				    		keyword.count += 1;
				    		keyword.save(function(){
				    			done(null);
				    		});
				    	}
				    	else {
				    		var newKey = new Keyword({keyword:term, count:1});
				    		newKey.save(function(){
				    			done(null);
				    		});
				    	}
				    });}
					}
				],

				// FINAL CALLBACK
				function() {
					callback();
				});
		  },

		  function(){
		  	article.processedKeywords=true;
		  	article.save(function(){
						console.timeEnd('One article');
						exports.makelist();
					});
		  }
		);
	});
};
