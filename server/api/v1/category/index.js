var express = require('express');
var services = require('./category.service');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;


router.post('/addupdate-category', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.addUpdateCategoryService);
router.get('/get-category/:categoryID/:activeStatus?', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.getCategoryService);
router.delete('/remove-category/:categoryID', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.deleteCategoryService);
