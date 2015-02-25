'use strict';

var Blacklist = require('./blacklist.model');
var Keyword = require('../keywords/keywords.model');


exports.create = function(req, res) {
  if (!req._body) return res.status(400).end();

  var newBL = new Blacklist();
  newBL.keyword = req.body.keyword;
  newBL.save(function(err) {
    if (err) return res.status(400).end();

    Keyword.findOneAndRemove({keyword:req.body.keyword}, function(err) {
      res.status(200).end();
    });
  });
};

exports.index = function(req, res) {
  Blacklist.find(function(err, bl) {
    res.status(200).json(bl);
  });
}
