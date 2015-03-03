var mongoose = require('mongoose');

var journals = require('./journals');

mongoose.connect('mongodb://localhost/scrapper');

journals.cleanJournals();
