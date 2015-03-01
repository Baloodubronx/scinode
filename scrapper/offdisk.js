var fs=require('fs');
var zlib = require('zlib');

function fetch() {
  var str='';
  var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
  link += '&query=PUB_YEAR:'+date+'&page='+page;

  var request = http.get(link);
  request.on('response', function(response) {
    console.log(response);
    fs.mkdir('data/'+date, function(err){
      var output = fs.createWriteStream('data/'+date+'/'+page+'.gzip');
      response.pipe(zlib.createGzip()).pipe(output);
      console.log('Year: '+date+' - page '+ page);
      fetch(date, ++page);
    });
  });
}
