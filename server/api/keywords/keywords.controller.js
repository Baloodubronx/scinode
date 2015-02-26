'use strict';

var Keyword = require('./keywords.model');


exports.index = function(req, res) {
  Keyword.find({white:false}).sort({'count':-1}).limit(20).exec(function(err, keywords) {
    if(err) return res.status(400).end();
    res.status(200).json(keywords);
  });
};

exports.getWhitelist = function(req, res) {
  Keyword.find({white:true}).sort({'count':-1}).exec(function(err, keywords) {
    if(err) return res.status(400).end();
    res.status(200).json(keywords);
  });
};


exports.setWhitelist = function(req, res) {
  Keyword.update(
		{keyword:req.body.keyword},
		{white : true},
		{upsert: false},
		function(err){
      if (err) return res.status(400).end();
      return res.status(200).end();
    }
	);
};
