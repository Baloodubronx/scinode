http=require('http');

var async=require('async');
var _ = require('lodash');

var Keyword = require('./keywords.model');
var Blacklist = require('./blacklist.model');
var Article = require('../articles/articles.model');

exports.makelist = function () {
	Article.findOne({'processed':false} , function(err, article){
		if (!article) {
			console.log('no more unprocessed articles');
			process.exit(code=1);
		}
		var str = article.abstractText + ' ' + article.title;
		var temparray1 = str.toLowerCase().match(/\w+/g);
		var temparray2 = str.toLowerCase().match(/\w+\s\w+/g);
		var temparray3 = str.toLowerCase().match(/\w+\s\w+\s\w+/g);

		var finalarray = temparray1.concat(temparray2).concat(temparray3);
		finalarray = _.difference(finalarray, ['']);

		async.each(finalarray,
		  function(term, callback){
				if (term==='') callback();

				Blacklist.findOne({'keyword':term}, function(err, bl) {
					if (err || bl) {callback();}
					else {
						Keyword.findOne({'keyword':term}, function(err, keyword){
				    	if (keyword) {
				    		keyword.count += 1;
				    		keyword.save(function(){
				    			callback();
				    		});

				    	}
				    	else {
				    		var newKey = new Keyword({keyword:term, count:1});
				    		newKey.save(function(){
				    			callback();
				    		});
				    	}
				    });
					}
				});

		  },

		  function(err){
		  	article.processed=true;
		  	article.save(function(){
						exports.makelist();
					});

		  }
		);


	});
}
