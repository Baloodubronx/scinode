/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Journal = require('./journals.model');

// Creates a new thing in the DB.
exports.create = function(journal) {
  
  Journal.findOne({'nlmid': journal.nlmid}, function(err, journalfound){
    if (err) return console.log(err);
    if (journalfound) {
    }
    else {
      var newJournal  = new Journal(journal);
      newJournal.save();
      Journal.find().count(function(err, count){
        console.log(count + ' journals in DB');
      });
    }
  });
};