var express = require('express');
var services = require('./other.service');
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
router.post('/active', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.tableActiveService);
router.get("/getModule", middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.getModuleService);
router.post('/upload', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.uploadImageService);
router.get('/get-media/:type/:imageType/:fileName', services.getMediaService);