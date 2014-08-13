var http=require('http');
var str = '';

http.get('http://www.ebi.ac.uk/europepmc/webservices/rest/search/query=autebert&format=json&resulttype=core', function(response) {

        response.on('data', function (chunk) {
              str += chunk;
        });

        response.on('end', function () {
                var json=JSON.parse(str);
                console.log(json);
              
        });
        
});