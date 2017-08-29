var express = require('express');
var controller = require('./user.controller');
var services = require('./user.service');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;

router.post('/user-signup', middleware.logger, services.signupService);
router.post('/user-signin', middleware.logger, services.signinService);
router.post('/signout', middleware.checkAccessToken, middleware.logger, services.signoutService);
router.post('/user-changepassword', middleware.checkAccessToken, middleware.logger, services.changePasswordService);
router.post('/user-forgotpassword', middleware.logger, services.forgotPasswordService);
router.get('/get-userlist/:user_type', middleware.checkAccessToken,middleware.userRightsByAPI,middleware.logger, services.getUserListService);
router.post('/user-sendotp', middleware.logger, services.sendOTPService);
router.post('/user-verifyotp', middleware.logger, services.verifyOTPService);
router.post('/addupdate-adminuser',middleware.checkAccessToken,middleware.userRightsByAPI,middleware.logger, services.addUpdateAdminService);
router.get('/get-adminuser', middleware.checkAccessToken,middleware.userRightsByAPI,middleware.logger, services.getAdminService);
router.get('/get-userrole/:role_id/:user_type_id',middleware.checkAccessToken,middleware.userRightsByAPI, middleware.logger, services.getRoleService);
router.delete('/remove-adminuser/:user_id',middleware.checkAccessToken,middleware.userRightsByAPI, middleware.logger, services.removeAdminService);
router.post('/user-signin-admin', services.signinServiceAdmin);


router.get('/get-usertype', middleware.checkAccessToken,middleware.userRightsByAPI,middleware.logger, services.getUserTypeService);
