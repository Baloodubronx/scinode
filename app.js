var http=require('http');
var mongoose = require('mongoose');

var config = require('./config');
var pubmed = require('./functions/pubmed');

mongoose.connect(config.mongo.uri, config.mongo.options);

pubmed.getPMIDs(process.env.YEAR || 2013,process.env.PAGE || 1);