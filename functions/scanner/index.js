http=require('http');

articles=require('../articles');
var Journal = require('../journals/journals.model');
var Article = require('../articles/articles.model');

var Citation = require('../citations/citations.model');


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
		//console.log(article);
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


exports.getMostCited = function() {
	var q = Citation.find().sort({'citedBy':-1}).limit(5);
	q.exec(function(err, citations){
		if (err) {
			console.log(err);
		}
		if (citations) {
			citations.forEach(function(citation){
				Journal.findOne({nlmid:citation.nlmid}, function(err, journal) {
					if (journal) console.log(journal.title+ ' : '+citation.citedBy);
				});
			});
		}
		
	});
}

exports.citedCount = function(nb) {
	Article.findOne({'processed':false} , function(err, article){
		if (!article) {
			console.log('no article');
			process.exit(code=1);
		}
		var journalNLMID = article.journalInfo.journal.nlmid;
		var citedCount = article.citedByCount;


		Citation.findOne({'nlmid':journalNLMID}, function(err, citation){
			if (err) {
				console.log(err);
			}
			if (citation) {
				citation.citedBy = citation.citedBy + citedCount;
				citation.save();
					article.processed=true;
					article.save(function(){
						nb++;
						console.log('Done: '+article.pmid + ' - ' +nb);
						exports.citedCount(nb);
					});
			}
			else {
				var newCitation = new Citation();
				newCitation.nlmid = journalNLMID;
				newCitation.citedBy = citedCount;
				newCitation.save(function(err){
					article.processed=true;
					article.save(function(){
						nb++;
						console.log('Done: '+article.pmid  + ' - ' +nb);
						exports.citedCount(nb);
					});
					
				});
			}

			

		});


	});
}

exports.cleanArticles = function() {
	console.time('cleanArticles');

	var q=Article.update({},{$set: {processed: false}}, {upsert: true, "new": false, multi:true});
	
	q.exec(function(err, article){
		Citation.remove({},function(){
		console.timeEnd('cleanArticles');
		process.exit(code=0);
		});
		
	});


	
}






