'use strict';

var Whitelist = require('../../../models/whitelist.model');
var Keyword = require('../../../models/keywords.model');


exports.create = function(req, res) {
  if (!req._body) return res.status(400).end();

  var newWL = new Whitelist();
  newWL.keyword = req.body.keyword;
  newWL.count=req.body.count;
  newWL.save(function(err) {
    if (err) return res.status(400).end();
    Keyword.findOneAndRemove({keyword:req.body.keyword}, function(err) {
      res.status(200).end();
    });
  });
};

exports.index = function(req, res) {
  Whitelist.find(function(err, bl) {
    res.status(200).json(bl);
  });
}
