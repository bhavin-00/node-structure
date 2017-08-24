var express = require('express');
var controller = require('./other.controller');
var middleware = require('../../../middleware');
var formidable = require('express-formidable');
var constant = require('../constant');

var router = express.Router();
module.exports = router;

router.use(formidable.parse({
  keepExtensions: true,
  uploadDir: constant.appConfig.MEDIA_UPLOAD_DIR
}));




//table Active API
router.post('/active', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.tableActive);
router.get("/getModule", middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.getModule);
router.post('/upload', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, controller.uploadImage);
router.get('/get-media/:type/:imageType/:fileName', controller.getMedia);