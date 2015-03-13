'use strict';

var express = require('express');
var controller = require('./authors.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/year/:year', controller.indexYear);
//router.post('/', controller.create );
//router.delete('/:id',auth.hasRole('admin'), controller.destroy);

module.exports = router;
