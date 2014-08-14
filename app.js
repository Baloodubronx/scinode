var http=require('http');
var str = '';
var number=1;

getPMID = function() {
	var link = 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/format=json&resulttype=core';
	str='';
	link += '&query=PUB_YEAR:2013&page='+number;
	http.get(link, function(response) {
        response.on('data', function (chunk) {
              str += chunk;
        });
        response.on('end', function () {
                var json=JSON.parse(str);
                console.log(number);
                number++;
                if (number < 10) {
                	getPMID();
                }
        });
    });
};

getPMID();