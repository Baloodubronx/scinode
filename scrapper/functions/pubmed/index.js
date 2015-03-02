http=require('http');

articles=require('../articles');
var Journal = require('../../../models/journals.model');
var Article = require('../../../models/articles.model');


function getPMIDs(year, page) {
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	str='';
	link += '&query=PUB_YEAR:'+year+'&page='+page;
	console.log(link);
	var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			var json=JSON.parse(str);
			articles.create(json.resultList.result, function(){
				getPMIDs(year, ++page);
			});
		});

	});

	getRequest.on('error', function (err) {
    		console.log(err);
    		getPMIDs(year, page);
		});
}

exports.getPMIDs = getPMIDs;
