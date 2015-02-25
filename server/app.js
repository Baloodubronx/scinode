'use strict';

var express = require('express');
var mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/scrapper', {db: {safe: true}});

// Setup server
var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(4444, function () {
  console.log('Express server listening 4444');
});

// Expose app
exports = module.exports = app;
