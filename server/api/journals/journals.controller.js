'use strict';

var Journal = require('../../../models/journals.model');


exports.create = function(req, res) {

};

exports.index = function(req, res) {
  Journal.find({'journalYear.year':2014, 'journalYear.4.articleCount':{$gt:20}}, {'title':1, 'journalYear.ratio':1, '_id':0}).sort({'journalYear.4.ratio':-1}).limit(10000).exec(function(err, jl) {
    res.status(200).json(jl);
  });
};

exports.indexYear = function(req, res) {
  var year = req.params.year;
  var pouet = {}, pouet2= {};
  pouet['journalYear.year'] = year;
  pouet['journalYear.'+(year-2010)+'.articleCount'] = {$gt:30};
  pouet2['journalYear.'+(year-2010)+'.ratio']=-1;
  console.log(pouet);
  Journal.find(pouet, {'title':1, 'journalYear.ratio':1, '_id':0}).sort(pouet2).limit(10000).exec(function(err, jl) {
    res.status(200).json(jl);
  });
};
