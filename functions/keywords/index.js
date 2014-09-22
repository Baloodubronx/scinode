http=require('http');

var async=require('async');

var Keyword = require('./keywords.model');
var Blacklist = require('./blacklist.model');
var Article = require('../articles/articles.model');

exports.makelist = function () {
	Article.findOne({'processed':false} , function(err, article){
		if (!article) {
			console.log('no article');
			process.exit(code=1);
		}
		var str = article.abstractText;
		str = str.replace(/[^\w\s]/gi, '').toLowerCase();
		var termArray = str.split(" ");
		
		async.each(termArray,
		  function(term, callback){
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