var http=require('http');
var mongoose = require('mongoose');

//var config = require('./config');
var scanner = require('./functions/scanner');

mongoose.connect('mongodb://localhost/scrapper');

scanner.cleanArticles();
