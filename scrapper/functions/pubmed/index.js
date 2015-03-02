http=require('http');

articles=require('../articles');
var Journal = require('../../../models/journals.model');
var Article = require('../../../models/articles.model');


exports.getPMIDs = function(year, page) {
	console.time('get from pubmed');
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	str='';
	link += '&query=PUB_YEAR:'+year+'&page='+page;
	console.log(link);
	var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			console.timeEnd('get from pubmed');
			var json=JSON.parse(str);
			console.time('Create article');
			articles.create(json.resultList.result, function(){
				console.timeEnd('Create article');
				exports.getPMIDs(year, ++page);
			});
		});

	});

	getRequest.on('error', function (err) {
    		console.log(err);
    		exports.getPMIDs(year, page);
		});
};

exports.checkPMIDs = function(year, page) {
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=idlist';
	str='';
	link += '&query=PUB_YEAR:'+year+'&page='+page;
	console.log(link);
	var getRequest = http.get(link, function(response) {
		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			var json=JSON.parse(str);
			articles.check(json.resultList.result, function(){
				exports.checkPMIDs(year, ++page);
			});
		});

	});

	getRequest.on('error', function (err) {
    		console.log(err);
    		exports.checkPMIDs(year, page);
		});
};
