http=require('http');

articles=require('../articles');
var Journal = require('../journals/journals.model');
var Article = require('../articles/articles.model');


exports.authorCount = function () {
	var authors = [];
	var counts = [];
	var q=Article.find().limit(process.env.MAX || 2);
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
		console.log(article);
		});
		
		for (var i=0; i<counts.length; i++) {
			if (counts[i]>2) {
				//console.log(authors[i]);
			}
		}
		console.log(authors.length);
		console.timeEnd('authorCount');
		process.exit(code=0);
	});
}

exports.citedCount = function() {
	var journals = [];
	var counts = [];
	var q=Article.find().limit(process.env.MAX || 100);

	console.time('citedCount');

	q.exec(function(err, articles){
		articles.forEach(function(article){
			var journalName = article.journalInfo.journal.isoabbreviation;
			var citedCount = article.citedByCount;

			var theindex=journals.indexOf(journalName);
			if (theindex>0) {
				counts[theindex]+=1;
			}
			else {
				journals.push(journalName);
				counts.push(citedCount);	
			}
		});

		/*for (var i=0; i<counts.length; i++) {
			if (counts[i]>2) {
				console.log(journals[i] + ' : ' + counts[i]);
			}
		}*/

		var i = counts.indexOf(Math.max.apply(Math, counts));

		console.log(journals[i] + ' : ' + counts[i]);

		console.timeEnd('citedCount');
		process.exit(code=0);

	});
}






