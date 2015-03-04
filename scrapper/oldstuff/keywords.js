'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scrapper');

var keywords = require('./keywords/index');
keywords.makelist();
