'use strict';

var express = require('express');
var controller = require('./keywords.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/whitelist', controller.getWhitelist);
router.post('/whitelist', controller.setWhitelist);
//router.post('/',auth.hasRole('admin'), controller.create );
//router.delete('/:id',auth.hasRole('admin'), controller.destroy);

module.exports = router;
