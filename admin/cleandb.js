var http=require('http');
var mongoose = require('mongoose');

var config = require('../config');
var journals = require('../functions/journals');

mongoose.connect(config.mongo.uri, config.mongo.options);

journals.clean();