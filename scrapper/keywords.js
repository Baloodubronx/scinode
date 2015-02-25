var http=require('http');
var mongoose = require('mongoose');

//var config = require('./config');
var keywords = require('./functions/keywords');

mongoose.connect('mongodb://localhost/scrapper');

//scanner.authorCount();


keywords.makelist();
