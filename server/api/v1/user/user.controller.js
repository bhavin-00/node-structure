var debug = require('debug')('server:api:v1:user:controller');
var userService = require('./user.service');
var constant = require('../constant');


/**
 * Created By: CBT
 * Updated By: CBT
 * [signup description]
 * @param  {Object} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var signup =  function (request, response) {
    debug("user.controller -> singup");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signupService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST
        });
    }
};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 * User Signin
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var signin = function (request, response) {
    debug("user.controller -> signin");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signinService(request, function (result) {
            if (result.status === true) {
                var session = request.session;
                session.userInfo = {
                    userId: result.data[0].user_id,
                    name: result.data[0].name,
                    mobile: result.data[0].mobile,
                    role: result.data[0].role,
                    userTypeID: result.data[0].user_type_id
                };
                var userRights = [];
                for (var i = 0; i < result.data.length; i++) {
                    var objRights = {};
                    objRights.moduleName = result.data[i].module_name;
                    objRights.canView = result.data[i].can_view;
                    objRights.canAddEdit = result.data[i].can_add_edit;
                    objRights.canDelete = result.data[i].can_delete;
                    objRights.adminCreated = result.data[i].admin_created;
                    userRights.push(objRights);
                }
                request.session.userInfo.userRights = userRights;
                return response.send({
                    status: result.status,
                    access_token: result.access_token,
                    data: result.data[0]
                });
            }
            else {
                return response.send(result);
            }

        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
    }
};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 * signout function is use for signout user
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var signout = function (request, response) {
    debug("user.controller -> signout");
    userService.signoutService(request, function (result) {
        return response.send(result);
    });
};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 * changePassword in that verify userId and old password & update new password
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var changePassword = function (request, response) {
    debug("user.controller -> changePassword");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.changePasswordService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_CHANGE_PASSWORD_REQUEST
        });
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 * Forgot Password in that send link on user register email
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var forgotPassword = function (request, response) {
    debug("user.controller -> forgotPassword");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.forgotPasswordService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_FORGOT_PASSWORD_REQUEST
        });
    }
};

/**
* Created By: CBT
* Updated By: CBT
* @param  {object} request
* @param  {object} response
* @return {object}
*/
var getUserList = function (request, response) {
    debug("user.controller -> getUserList");
    if (request.session.userInfo !== undefined) {
        userService.getUserListService(request, function (result) {
            return response.send(result);
        })
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_GET_USERLIST_REQUEST
        });
    }
}


/**
 * Created By: CBT
 * Updated By: CBT
 * [sendOTP description]
 * @param  {object} request  [description]
 * @param  {object} response [description]
 * @return {object}          [description]
 */
var sendOTP = function (request, response) {
    debug("user.controller -> sendOTP");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.sendOTPService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SEND_OTP_REQUEST
        });
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 * Verify OTP
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var verifyOTP = function (request, response) {
    debug("user.controller -> verifyOTP");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.verifyOTPService(request, function (result) {
            if (result.status === true) {
                var session = request.session;
                session.userInfo = {
                    accessToken: result['access-token'],
                    userId: result.data.user_id,
                    name: result.data.name,
                    mobile: result.data.mobile
                };
            }
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST
        });
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var addUpdateAdmin = function (request, response) {
    debug("user.controller -> signup Admin");
    if (request.body != undefined && typeof request.body === "object") {
        userService.addUpdateAdminService(request, function (result) {
            return response.send(result);
        })
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST
        });
    }
}

/**
* Created By: CBT
* Updated By: CBT
*  @param  {object} request
* @param  {object} response
* @return {object}
*/
var getAdmin = function (request, response) {
    debug("user.controller -> get admin");
    if (request.session.userInfo !== undefined) {
        userService.getAdminService(request, function (result) {
            return response.send(result);
        })
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_REQUEST_GET_USER_LIST
        });
    }
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [getRole description]
 * @param  {object} request  [description]
 * @param  {object} response [description]
 * @return {object}          [description]
 */
var getRole = function (request, response) {
    debug("user.controller -> getRole");
    if (request.session.userInfo !== undefined) {
        userService.getRoleService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.userMessages.ERR_INVALID_GET_ROLE_REQUEST
        });
    }
};


/**
* Created By: CBT
* Updated By: CBT
* @param  {object} request
* @param  {object} response
* @return {object}
*/
var removeAdmin = function (request, response) {
    debug("user.controller -> get admin");
    if (request.session.userInfo !== undefined) {
        userService.removeAdminService(request, function (result) {
            return response.send(result);
        })
    } else {
        return response.send({
            status: false,
            error: constant.userMessages.ERR_INVALID_USER_DELETE_REQUEST
        });
    }
}

/**
* Created By: CBT
* Updated By: CBT
* @param  {object} request
* @param  {object} response
* @return {object}
*/
var signinAdmin = function (request, response) {
    console.log("user.controller - > signin Admin");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signinServiceAdmin(request,response, function (result) {
            if (result.status === true) {
                var session = request.session;
                session.userInfo = {
                    userId: result.data[0].user_id,
                    name: result.data[0].name,
                    mobile: result.data[0].mobile,
                    role: result.data[0].role,
                    userTypeID: result.data[0].user_type_id
                };
                var userRights = [];
                for (var i = 0; i < result.data.length; i++) {
                    var objRights = {};
                    objRights.moduleName = result.data[i].module_name;
                    objRights.canView = result.data[i].can_view;
                    objRights.canAddEdit = result.data[i].can_add_edit;
                    objRights.canDelete = result.data[i].can_delete;
                    objRights.adminCreated = result.data[i].admin_created;
                    userRights.push(objRights);
                }
                request.session.userInfo.userRights = userRights;
                return response.send(result);
            } else {
                return response.send(result);
            }

        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
    }
}


/**
 * Created By: CBT
 * Updated By: CBT
 * [getUserType description]
 * @param  {object} request  [description]
 * @param  {object} response [description]
 * @return {object}          [description]
 */
var getUserType = function (request, response) {
    debug("user.controller -> getUserType");
    if (request.session.userInfo !== undefined) {
        userService.getUserTypeService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.userMessages.ERR_INVALID_GET_USER_TYPE_REQUEST
        });
    }
};
module.exports = {
    signup: signup,
    signin: signin,
    signout: signout,
    changePassword: changePassword,
    forgotPassword: forgotPassword,
    getUserList: getUserList,
    sendOTP: sendOTP,
    verifyOTP: verifyOTP,
    addUpdateAdmin: addUpdateAdmin,
    getAdmin: getAdmin,
    getRole: getRole,
    removeAdmin: removeAdmin,
    signinAdmin: signinAdmin,
    getUserType: getUserType,
}
