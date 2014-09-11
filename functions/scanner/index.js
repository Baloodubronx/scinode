http=require('http');

articles=require('../articles');
var Journal = require('../journals/journals.model');
var Article = require('../articles/articles.model');


exports.authorCount = function () {
	var authors = [];
	var counts = [];
	var q=Article.find().limit(10000);
	console.time('authorCount');

	q.exec(function(err, articles){
		articles.forEach(function(article){
			article.authorList.author.forEach(function(author){
				var fullname=author.fullName;
				var theindex=authors.indexOf(fullname);
				if (theindex>0) {
					counts[theindex]+=1;
				}
				else {
					authors.push(fullname);
					counts.push(1);	
				}
			});
			
		});
		
		for (var i=0; i<counts.length; i++) {
			if (counts[i]>2) {
				//console.log(authors[i]);
			}
		}
		console.timeEnd('authorCount');
		process.exit(code=0);
	});
}