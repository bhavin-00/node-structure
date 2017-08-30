var express = require('express');
var services = require('./role.service');
var middleware = require('../../../middleware');
var constant = require('../constant');

var router = express.Router();
module.exports = router;


router.post('/addupdate-role', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.addRoleService);
router.get("/get-roleModuleMapping/:role_id/:module_id", middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.getRoleModuleMappingService);
router.delete('/remove-role/:role_id', middleware.checkAccessToken, middleware.userRightsByAPI, middleware.logger, services.removeRoleService);
