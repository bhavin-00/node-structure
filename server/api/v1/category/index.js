var express = require('express');
var controller = require('./category.controller');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;


router.post('/addupdate-category', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.addUpdateCategory);
router.get('/get-category/:categoryID/:activeStatus?', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.getCategory);
router.delete('/remove-category/:categoryID', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.deleteCategory);
