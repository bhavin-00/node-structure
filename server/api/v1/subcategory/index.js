var express = require('express');
var controller = require('./subcategory.controller');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;


router.post('/addupdate-subcategory', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.addUpdateSubCategory);
router.get('/get-subcategory/:subCategoryID/:activeStatus?', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.getSubCategory);
router.delete('/remove-subcategory/:subCategoryID', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.deleteSubCategory);
