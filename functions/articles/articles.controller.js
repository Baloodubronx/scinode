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
var Article = require('./articles.model');
var journals = require('../journals');

// Creates a new thing in the DB.
exports.create = function(articles) {
    articles.forEach(function(item){
            if (item.journalInfo!=null) {
              journals.create(item.journalInfo.journal); }
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return done(err);
        if (article) {
          
        }
        else {
          var newArticle  = new Article(item);
          newArticle.save();
        }
      });

    });
};