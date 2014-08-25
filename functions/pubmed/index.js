http=require('http');

articles=require('../articles');
var Journal = require('../journals/journals.model');
var Article = require('../articles/articles.model');


function getPMIDs(year, page) {
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	str='';
	link += '&query=PUB_YEAR:'+year+'&page='+page;
	console.log(link);
	http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});
	
		response.on('end', function () {
			var json=JSON.parse(str);
			articles.create(json.resultList.result);
			Journal.find().count(function(err, count){
        		console.log(count + ' journals in DB');
      		});
      		Article.find().count(function(err, count){
        		console.log(count + ' articles in DB');
      		});
			getPMIDs(year, ++page);
		});
		response.on('error', function (err) {
    		console.log(err);
    		getPMIDs(year, page);
		});
	});
}

exports.getPMIDs = getPMIDs;