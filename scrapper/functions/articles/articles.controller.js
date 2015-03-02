/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */


var async = require('async');
var _ = require('lodash');
var Article = require('../../../models/articles.model');
var journals = require('../../journals');

// Creates a new thing in the DB.
exports.create = function(articles, cb) {
  async.each(articles,
    function(item, callback){
      if (item.journalInfo!==null) {
        journals.create(item.journalInfo.journal, 0, function(){});
      }
      Article.findOne({'pmid': item.pmid}, function(err, article){
        if (err) return done(err);
        if (!article) {
          var newArticle  = new Article(item);
          newArticle.save(function(err){
            callback();
          });
        }
        else { callback();}
      });
    },
    function(err) {
      cb();
    });
};
