var debug = require('debug')('server:api:v1:user:service');
var d3 = require("d3");
var md5 = require('md5');
var uuid = require('uuid');
var DateLibrary = require('date-management');
var randomstring = require("randomstring");
var common = require('../common');
var constant = require('../constant');
var userDAL = require('./user.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var sendSMSObj = require('../../../helper/sendsms');
var config = require('../../../../config');
var smsConfig = config.smsConfig;


/**
 * Created By: CBT
 * Updated By: CBT
 * [signup description]
 * @param  {Object} request  [description]
 * @param  {Object} response [description]
 * @return {[type]}          [description]
 */
var signupService = async function (request, response) {
    debug("user.service -> signupService");
    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.name, request.body.email, request.body.country_code, request.body.number, request.body.password]);
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST, false);

    var userinfo = {};
    userinfo.fk_roleID = constant.userRole.admin;
    userinfo.name = request.body.name;
    userinfo.email = request.body.email;
    userinfo.countryCode = request.body.country_code;
    userinfo.mobile = request.body.number;
    userinfo.password = md5(request.body.password);
    // userinfo.isVerified = 1;

    var userKeys = Object.keys(userinfo);
    var userfieldValueInsert = [];
    userKeys.forEach(function (userKeys) {
        if (userinfo[userKeys] !== undefined) {
            var fieldValueObj = {};
            fieldValueObj = {
                field: userKeys,
                fValue: userinfo[userKeys]
            }
            userfieldValueInsert.push(fieldValueObj);
        }
    });

    try {
        var result = await userDAL.checkUserIsExist(userinfo.countryCode, userinfo.mobile, userinfo.email);
        if (result.content.length > 0) {
            if (result.content[0].is_active == false)
                return common.sendResponse(response, constant.userMessages.ERR_USER_IS_NOT_ACTIVE, false);
            if (result.content[0].is_verify == true)
                return common.sendResponse(response, constant.userMessages.ERR_USER_IS_ALREADY_EXIST, false);
        }

        var res_create_user = await userDAL.createUser(userfieldValueInsert)
        return common.sendResponse(response, constant.userMessages.MSG_SIGNUP_SUCCESSFULLY, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};
/**
 * Created By: CBT
 * Updated By: CBT
 *
 * signin using mobileNumber with countryCode and password
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */

var signinService = async function (request, response) {
    debug("user.service -> signinService");

    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.user_name, request.body.password]);
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST, false);

    if (request.body.user_name.indexOf("@") > 0 && request.body.user_name.lastIndexOf(".") > request.body.user_name.indexOf("@") + 2 && request.body.user_name.lastIndexOf(".") + 2 <= request.body.user_name.length) {
        var email = request.body.user_name;
    } else if (request.body.user_name.match(/\d+/g) != null && request.body.user_name.match(/\d+/g)[0].length == 10) {
        var mobile = request.body.user_name;
    } else {
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST, false);
    }

    var countryCode = "+91";
    var password = md5(request.body.password);

    try {
        let result = await userDAL.userLogin(countryCode, mobile, password, email, "test");

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

        // return common.sendResponse(response, result.data[0], true)
        return response.send({
            status: result.status,
            access_token: result.access_token,
            data: result.data[0]
        });
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.ERR_SIGNOUT_IS_NOT_PROPER, false);
    }

};

/**
 * Created By: CBT
 * Updated By: CBT
 * [checkAndCreateAccessToken description]
 * @param  {Object}   request  [description]
 * @param  {Object}   userInfo [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
async function checkAndCreateAccessToken(request, userInfo) {
    // return new Promise(function (resolve,reject){
    try {
        var userId = userInfo[0].user_id;
        var token = uuid.v1();
        var deviceId = request.headers["udid"];
        var deviceType = (request.headers["device-type"]).toLowerCase();
        var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
            operationType: "Absolute_DateTime",
            granularityType: "hours",
            value: constant.appConfig.MAX_ACCESS_TOKEN_EXPIRY_HOURS
        });
        var host = request.hostname;
        let result = await userDAL.exprieAccessToken(userId, deviceId, host);

        let res_access_token = await userDAL.createAccessToken(userId, token, expiryDateTime, deviceId, host);

        let res_user_tran = await userDAL.checkUserTransaction(deviceId, deviceType);

        if (res_user_tran.content[0].totalCount > 0) {
            var fieldValueUpdate = [];
            fieldValueUpdate.push({
                field: "isLogedIn",
                fValue: 1
            });
            fieldValueUpdate.push({
                field: "lastLoginDatetime",
                fValue: d3.timeFormat(dbDateFormat)(new Date())
            });
            let res_transaction = userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate);

        }
        else {
            let res_transaction = userDAL.createUserTransaction(deviceId, deviceType);

        }
        return { status: true, "access_token": token, data: userInfo };
    }
    catch (ex) {
        debug(ex);
        throw ex;
    }
    // });
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 * signoutService signout to user and expire access-token and session
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */

var signoutService = async function (request, response) {
    debug("user.service -> signoutService");
    var deviceId = request.headers["udid"];
    var userId = request.session.userInfo.userId;
    var deviceType = request.headers["device-type"];
    var host = request.hostname;
    try {
        var result = await userDAL.exprieAccessToken(userId, deviceId, host);
        request.session.destroy();
        var fieldValueUpdate = [];
        fieldValueUpdate.push({
            field: "isLogedIn",
            fValue: "0"
        });

        var updateUserTraResult = await userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate);

        return common.sendResponse(response, constant.userMessages.MSG_SIGNOUT_SUCCESSFULLY, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.ERR_SIGNOUT_IS_NOT_PROPER, false);
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 * changePasswordService check first userId and old password and after chnage password
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var changePasswordService = async function (request, response) {
    debug("user.service -> changePasswordService");
    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.old_password, request.body.new_password, request.body.retype_password]);
    if (!isValidObject || !isValid || request.body.new_password != request.body.retype_password)
        return common.sendResponse(response, constant.userMessages.ERR_PASSWORD_NOT_MATCH, false);

    var userId = request.session.userInfo.userId;
    var oldPassword = md5(request.body.old_password);
    var newPassword = md5(request.body.retype_password);

    try {
        let result = await userDAL.validateUser(userId, oldPassword);
        if (result.content.length == 0 || result.content[0].totalCount == 0)
            return common.sendResponse(response, constant.userMessages.ERR_PASSWORD_NOT_MATCH, false);

        var fieldValueUpdate = [];
        fieldValueUpdate.push({
            field: "password",
            fValue: newPassword
        });

        var resultUpdateUserInfo = await userDAL.updateUserInfoById(userId, fieldValueUpdate);
        return common.sendResponse(response, constant.userMessages.MSG_PASSWORD_CHANGE_SUCCESSFULLY, true);

    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 * forgotPasswordService send link  user register email id
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var forgotPasswordService = async function (request, response) {
    debug("user.service -> forgotPasswordService");
    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.user_id, request.body.new_password, request.body.retype_password]);
    if (!isValidObject || !isValid || request.body.new_password != request.body.retype_password)
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_FORGOT_PASSWORD_REQUEST, false);

    var user_id = request.body.user_id;
    var password = md5(request.body.retype_password);

    try {
        let result = await userDAL.checkUserIdIsValid(user_id);
        if (result.content.length === 0)
            return common.sendResponse(response, constant.userMessages.ERR_USER_NOT_EXIST, false);

        var fieldValueUpdate = [];
        fieldValueUpdate.push({
            field: "password",
            fValue: password
        });

        let resultUpdateUserInfo = await userDAL.updateUserInfoById(user_id, fieldValueUpdate);
        return common.sendResponse(response, constant.userMessages.MSG_PASSWORD_CHANGE_SUCCESSFULLY, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 * getUserListService
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */

var getUserListService = async function (request, response) {
    let isValid = common.validateParams([request.params.user_type]);

    if (!isValid) {
        return common.sendResponse(response, constant.userMessages.ERR_INVALID_GET_ROLE_REQUEST, false);
    }

    try {
        var userType = request.params.user_type;

        let result = await userDAL.getUserByUserType(userType);
        return common.sendResponse(response, result.content, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
}


/**
 * Created By: CBT
 * Updated By: CBT
 * [sendOTPService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var sendOTPService = async function (request, response) {
    debug("user.service -> sendOTPService");
    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.mobile, request.body.country_code]);
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_SEND_OTP_REQUEST, false);

    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    try {
        let result = await userDAL.checkUserIsExist(countryCode, mobile, null);
        if (result.content.length === 0)
            return common.sendResponse(response, constant.userMessages.ERR_USER_NOT_EXIST, false);
        return await sendOTP(countryCode, mobile);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }

};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 * @param  {string}   countryCode
 * @param  {string}   mobile
 * @param  {Function} cb
 * @return {object}
 */
async function sendOTP(countryCode, mobile) {
    debug("user.service -> sendOTP");
    try {
        var result = await userDAL.checkOTPLimit(countryCode, mobile);
        if (result.content.length > 0 && result.content[0].totalCount >= constant.appConfig.MAX_OTP_SEND_LIMIT)
            return common.sendResponse(response, constant.userMessages.ERR_OTP_LIMIT_EXCEEDED, false);

        let resultExpireOtp = await userDAL.exprieOTP(countryCode, mobile);

        var OTP = randomstring.generate(constant.appConfig.OTP_SETTINGS);
        var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
            operationType: "Absolute_DateTime",
            granularityType: "Seconds",
            value: constant.appConfig.MAX_OTP_EXPIRY_SECONDS
        });

        let resultSaveOtp = await userDAL.saveOTP(countryCode, mobile, OTP, expiryDateTime);

        var OTP_SENT_MSG_OBJ = common.cloneObject(constant.userMessages.MSG_OTP_SENT_SUCCEFULLY);
        OTP_SENT_MSG_OBJ.message = OTP_SENT_MSG_OBJ.message.replace("{{mobile}}", mobile.replace(/\d(?=\d{4})/g, "*"));
        // HACK remuve below line when SMS flow implement
        if (smsConfig.test === true) {
            OTP_SENT_MSG_OBJ.message += (" OTP " + OTP);
        } else {
            var countryCodeMobile = countryCode + mobile;
            var data = {
                otp: OTP
                // url: 'http://cricheroes.in'
            }
            sendSMSObj.sendSMS(countryCodeMobile, 'PM', data, function (resultSMS) {
                debug('send sms result', resultSMS);
            });

            return common.sendResponse(response, OTP_SENT_MSG_OBJ, true);
        }
    }
    catch (ex) {
        debug(ex);
        throw ex;
    }

}
/**
 * Created By: CBT
 * Updated By: CBT
 *
 * verify OTP service
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var verifyOTPService = async function (request, response) {

    debug("user.service -> verifyOTPService");

    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.mobile, request.body.country_code, request.body.otp]);
    if (!isValidObject || !isValid) {
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST, false);
    }

    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    var OTP = request.body.otp;
    try {
        return await verifyOTP(countryCode, mobile, OTP);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 * verifyOTP is internal function of user.service
 * this function check user enter enter OTP and mobile number is match and valid
 *
 * @param  {string}   countryCode [description]
 * @param  {string}   mobile      [description]
 * @param  {number}   OTP         [description]
 * @param  {Function} cb          [description]
 * @return {object}               [description]
 */

async function verifyOTP(countryCode, mobile, OTP) {
    debug("user.service -> verifyOTP");
    var currDateTime = new Date();
    try {
        let result = userDAL.validOTP(countryCode, mobile, currDateTime);
        if (result.content.length === 0)
            // OTP is Expire
            return common.sendResponse(response, constant.userMessages.ERR_OTP_IS_EXPIRED, false);

        var OTPobj = result.content[0];
        if (OTPobj.otp != OTP)
            // Invalid OTP
            return common.sendResponse(response, constant.userMessages.ERR_OTP_INVALID, false);

        if (OTPobj.otp == OTP && new Date(OTPobj.expiry_datetime).getTime() < currDateTime.getTime())
            // OTP is Expire
            return common.sendResponse(response, constant.userMessages.ERR_OTP_IS_EXPIRED, false);

        var filedValueUpdate = [{
            field: 'isVerified',
            fValue: 1
        }];

        let resultUpdateUserInfo = await userDAL.updateUserInfoByCountryCodeAndMobile(countryCode, mobile, filedValueUpdate);

        let resultExpireOtp = await userDAL.exprieOTP(countryCode, mobile);

        // Get UserINFO
        let resultGetUserInfo = await userDAL.getUserInfoByCountryCodeAndMobile(countryCode, mobile);
        if (result.content.length === 0)
            return common.sendResponse(response, constant.userMessages.ERR_USER_NOT_EXIST, false);

        return common.sendResponse(response, result.content[0], true);

    }
    catch (ex) {
        debug(ex);
        throw (ex);
    }

}


/**
 * Created By: CBT
 * Updated By: CBT
 * addUpdateAdminService
 * @param  {object}   request
 * @param  {Function} cb
 */
var addUpdateAdminService = async function (request, response) {
    debug("user.service -> addUpdateAdminService");

    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.user_id, request.body.name, request.body.email, request.body.country_code, request.body.mobile, request.body.password, request.body.role_id]);
    if (!isValidObject) {
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST, false);
    }
    else if (!isValid) {
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_ADD_UPDATE_REQUEST_OF_ADMIN_USER, false);
    }

    var userID = request.body.user_id;
    var userinfo = {};
    userinfo.fk_roleID = request.body.role_id;
    userinfo.name = request.body.name;
    userinfo.email = request.body.email;
    userinfo.countryCode = request.body.country_code;
    userinfo.mobile = request.body.mobile;
    if (request.body.password != undefined && request.body.password != "") {
        userinfo.password = md5(request.body.password);
    }
    userinfo.isVerified = 1;

    var userKeys = Object.keys(userinfo);
    var userfieldValueInsert = [];
    userKeys.forEach(function (userKeys) {
        if (userinfo[userKeys] !== undefined) {
            var fieldValueObj = {};
            fieldValueObj = {
                field: userKeys,
                fValue: userinfo[userKeys]
            }
            userfieldValueInsert.push(fieldValueObj);
        }
    });

    try {
        var result = await userDAL.checkUserIsExist(userinfo.countryCode, userinfo.mobile, userinfo.email);
        if (userID == -1 && result.content.length > 0) {
            return common.sendResponse(response, constant.userMessages.ERR_USER_IS_ALREADY_EXIST, false);
        }
        if (userID == -1) {
            var res_create_user = await userDAL.createUser(userfieldValueInsert)
            return common.sendResponse(response, constant.userMessages.MSG_ADMIN_SUCESSFULLY_CREATED, true);
        }
        else {
            if (result.content.length == 0) {
                return common.sendResponse(response, constant.userMessages.ERR_USER_NOT_EXIST, false);
            }
            else if (result.content.length > 0 && result.content[0].user_id == userID) {
                var res_update_user = await userDAL.updateUserInfoById(userID, userfieldValueInsert)
                return common.sendResponse(response, constant.userMessages.MSG_ADMIN_SUCESSFULLY_UPDATED, true);
            }
            else {
                return common.sendResponse(response, constant.userMessages.ERR_USER_IS_ALREADY_EXIST, false);
            }
        }
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }

}
/**
 * Created By: CBT
 * Updated By: CBT
 * get admin service
 * @param  {object}   request
 * @param  {Function} cb
 */

var getAdminService = async function (request, response) {
    debug("user.service -> getAdminService");
    try {
        var result = await userDAL.getUserByUserType(constant.userType.admin);
        return common.sendResponse(response, result.content, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
}


/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */


var getRoleService = async function (request, response) {
    debug("user.service -> getRoleService");
    let isValid = common.validateParams([request.params.role_id, request.params.user_type_id]);

    if (!isValid) {
        return common.sendResponse(response, constant.userMessages.ERR_INVALID_GET_ROLE_REQUEST, false);
    }

    try {
        var roleID = request.params.role_id;
        var userTypeID = request.params.user_type_id;

        let result = await userDAL.getRole(roleID, userTypeID);
        return common.sendResponse(response, result.content, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeAdminService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var removeAdminService = async function (request, response) {
    debug("user.service -> removeAdminService");
    var isValid = common.validateParams([request.params.user_id])
    try {
        var userID = request.params.user_id;
        let isValidResult = await userDAL.checkUserIdIsValid(userID);
        if (isValidResult.content.length === 0) {
            return common.sendResponse(response, constant.userMessages.ERR_INVALID_USER_DELETE_REQUEST, false);
        }
        let result = await userDAL.removeUser(userID);
        return common.sendResponse(response, constant.userMessages.MSG_USER_SUCESSFULLY_DELETED, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [signinServiceAdmin description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var signinServiceAdmin = async function (request, response) {
    debug("user.service -> signin service admin");
    let isValidObject = common.validateObject([request.body]);
    let isValid = common.validateParams([request.body.user_name, request.body.password])
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST, false);

    try {
        var email = request.body.email;
        var password = md5(request.body.password);

        let result = await userDAL.userLoginAdmin(email, password);

        if (result.content.length === 0) {
            return common.sendResponse(response, constant.userMessages.ERR_INVALID_EMAIL_AND_PASSWORD, false);
        } else {
            let res_access_token = await checkAndCreateAccessToken(request, result.content)

            if (res_access_token.status === true) {
                var session = request.session;
                session.userInfo = {
                    userId: res_access_token.data[0].user_id,
                    name: res_access_token.data[0].name,
                    mobile: res_access_token.data[0].mobile,
                    role: res_access_token.data[0].role,
                    userTypeID: res_access_token.data[0].user_type_id
                };
                var userRights = [];
                for (var i = 0; i < res_access_token.data.length; i++) {
                    var objRights = {};
                    objRights.moduleName = res_access_token.data[i].module_name;
                    objRights.canView = res_access_token.data[i].can_view;
                    objRights.canAddEdit = res_access_token.data[i].can_add_edit;
                    objRights.canDelete = res_access_token.data[i].can_delete;
                    objRights.adminCreated = res_access_token.data[i].admin_created;
                    userRights.push(objRights);
                }
                request.session.userInfo.userRights = userRights;

                return common.sendResponse(response, res_access_token, true);
            } else {
                return common.sendResponse(response, res_access_token, true);
            }

        }
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleSegetUserTypeServicervice description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */

var getUserTypeService = async function (request, response) {
    debug("user.service -> getUserTypeService");
    try {
        let result = await userDAL.getUserType();
        return common.sendResponse(response, result.content, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
}

module.exports = {
    signupService: signupService,
    signinService: signinService,
    signoutService: signoutService,
    changePasswordService: changePasswordService,
    forgotPasswordService: forgotPasswordService,
    getUserListService: getUserListService,
    sendOTPService: sendOTPService,
    verifyOTPService: verifyOTPService,
    addUpdateAdminService: addUpdateAdminService,
    getAdminService: getAdminService,
    getRoleService: getRoleService,
    removeAdminService: removeAdminService,
    signinServiceAdmin: signinServiceAdmin,
    getUserTypeService: getUserTypeService,
}
