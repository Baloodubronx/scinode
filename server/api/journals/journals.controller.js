'use strict';

var Journal = require('../../../models/journals.model');


exports.create = function(req, res) {

};

exports.index = function(req, res) {
  Journal.find().sort({citedBy:-1}).exec(function(err, jl) {
    res.status(200).json(jl);
  });
}
