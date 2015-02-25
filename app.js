var http=require('http');
var mongoose = require('mongoose');

//var config = require('./config');
var pubmed = require('./functions/pubmed');

mongoose.connect('mongodb://localhost/scrapper');

pubmed.getPMIDs(process.env.YEAR || 2014, process.env.PAGE || 1);
