var express = require('express');
var middleware = require('../../middleware');
var router = express.Router();
module.exports = router;

router.use('/user', middleware.checkRequestHeader, require('./user'));
router.use('/other', require('./other'));
router.use('/role', middleware.checkRequestHeader, require('./role'));
router.use('/category', middleware.checkRequestHeader, require('./category'));
router.use('/subcategory', middleware.checkRequestHeader, require('./subcategory'));