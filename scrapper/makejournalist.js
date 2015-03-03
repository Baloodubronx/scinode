var mongoose = require('mongoose');
var journals = require('./journals');

mongoose.connect('mongodb://localhost/scrapper');

journals.makeJournalList(process.env.YEAR || 2014, 0);
