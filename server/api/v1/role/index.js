var express = require('express');
var controller = require('./role.controller');
var middleware = require('../../../middleware');
var constant = require('../constant');

var router = express.Router();
module.exports = router;


router.post('/addupdate-role', middleware.checkAccessToken,middleware.userRightsByAPI, middleware.logger, controller.addRole);
router.get("/get-roleModuleMapping/:role_id/:module_id", middleware.checkAccessToken,middleware.userRightsByAPI, middleware.logger, controller.getRoleModuleMapping);
router.delete('/remove-role/:role_id',middleware.checkAccessToken,middleware.userRightsByAPI, middleware.logger, controller.removeRole);
