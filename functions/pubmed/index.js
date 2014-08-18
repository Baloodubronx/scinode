http=require('http');

articles=require('../articles');


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
			getPMIDs(year, ++page);
		});
	});
}

exports.getPMIDs = getPMIDs;