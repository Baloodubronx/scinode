var http=require('http');
var fs=require('fs');
var zlib = require('zlib');
var JSONStream = require('JSONStream');
var async = require('async');

var date='2014';
var page='50';

pmidsList(date, page);

function writeToDisk(date, page, pmid) {
  var str='';
  var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
  link += '&query='+pmid;

  var request = http.get(link);
  request.on('response', function(response) {

    fs.mkdir('data/PMIDS/'+date+'/'+page, function(err){
      var output = fs.createWriteStream('data/PMIDS/'+date+'/'+page+'/'+pmid+'.gzip');
      response
        .pipe(JSONStream.parse('resultList.result'))
        .pipe(JSONStream.stringify())
        .pipe(zlib.createGzip())
        .pipe(output);
    });
    /*fs.mkdir('data/'+date, function(err){
      var output = fs.createWriteStream('data/'+date+'/'+page+'.gzip');
      response.pipe(zlib.createGzip()).pipe(output);
      console.log('Year: '+date+' - page '+ page);
      fetch(date, ++page);
    });*/
  });
}

function pmidsList(date, page) {
  var str='';
  var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=idlist';
  link += '&query=PUB_YEAR:'+date+'&page='+page;
  console.log(link);

  var request = http.get(link);
  request.on('response', function(response) {
    response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
      var json=JSON.parse(str);
      res = json.resultList.result;
      res.forEach(function(item){
        if (item.pmid) {writeToDisk(date, page, item.pmid);}
      });
      pmidsList(date, ++page);
    });
  });

}
