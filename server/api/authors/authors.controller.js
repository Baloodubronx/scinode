'use strict';

var Author = require('../../../models/authors.model');



exports.index = function(req, res) {
  Author.find({'citationsYear.year':2014, 'citationsYear.4.articleCount':{$gt:20}}, {'title':1, 'citationsYear.ratio':1, '_id':0}).sort({'citationsYear.4.ratio':-1}).limit(10000).exec(function(err, jl) {
    res.status(200).json(jl);
  });
};

exports.indexYear = function(req, res) {
  var year = req.params.year;
  var pouet = {}, pouet2= {};
  pouet['citationsYear.year'] = year;
  pouet['citationsYear.'+(year-2010)+'.ratio'] = {$gt:0};
  pouet2['citationsYear.'+(year-2010)+'.ratio']=-1;
  console.log(pouet);
  Author.find(pouet, {'fullName':1, 'citationsYear.ratio':1, '_id':0}).sort(pouet2).limit(100).exec(function(err, auth) {
    res.status(200).json(auth);
  });
};
