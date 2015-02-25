'use strict';

var express = require('express');
var controller = require('./blacklist.controller');


var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create );
//router.delete('/:id',auth.hasRole('admin'), controller.destroy);

module.exports = router;
