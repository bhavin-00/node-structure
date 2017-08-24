var debug = require('debug')('server:api:v1:user:DAL');
var d3 = require("d3");
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./user.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;






/**
 * Created By: CBT
 * Updated By: CBT
 * [checkUserIsExist description]
 * @param  {int}   countryCode [description]
 * @param  {string}   mobile      [description]
 * @param  {string}   email      [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
var checkUserIsExist = function (countryCode, mobile,email, cb) {
  debug("user.DAL -> checkUserIsExist");
  var checkUserIsExistQuery = common.cloneObject(query.checkUserIsExistQuery);
  checkUserIsExistQuery.filter.or[0].and[0].value = countryCode;
  checkUserIsExistQuery.filter.or[0].and[1].value = mobile;
  if(email!=null){
    checkUserIsExistQuery.filter.or[1].value = email;
  }else{
    checkUserIsExistQuery.filter.or[1].value = "";
  }
  common.executeQuery(checkUserIsExistQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [createUser description]
 * @param  {Array of object}   fieldValue [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var createUser = function (fieldValue, cb) {
  debug("user.DAL -> createUser");
  var createUserQuery = common.cloneObject(query.createUserQuery);
  createUserQuery.insert = fieldValue;
  common.executeQuery(createUserQuery, cb);
};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 * signin using mobileNumber with countryCode and password
 *
 * @param  {string}   countryCode
 * @param  {string}   mobile
 * @param  {string}   password
 * @param  {string}   email
 * @param  {Function} cb
 * @return {object}
 */
var userLogin = function (countryCode, mobile, password, email, cb) {
  debug("user.DAL -> userLogin");
  var getUserInfoQuery = common.cloneObject(query.getUserInfoQuery);
  if (countryCode != "" && mobile != "" && mobile != undefined) {
    getUserInfoQuery.filter.and[1].or[2].and[0].value = countryCode;
    getUserInfoQuery.filter.and[1].or[2].and[1].value = mobile;
    getUserInfoQuery.filter.and[1].or[2].and[2].value = password;
  }
  else if (email != "" && email != undefined) {
    getUserInfoQuery.filter.and[1].or[3].and[0].value = email;
    getUserInfoQuery.filter.and[1].or[3].and[1].value = password;
  }
  common.executeQuery(getUserInfoQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 *
 * @param  {string}   userId
 * @param  {string}   deviceId
 * @param  {string}   host
 * @param  {Function} cb
 * @return {object}
 */
var exprieAccessToken = function (userId, deviceId, host, cb) {
  debug("user.DAL -> exprieAccessToken");
  var updateAccessTokenQuery = common.cloneObject(query.updateAccessTokenQuery);
  if (userId === undefined) {
    updateAccessTokenQuery.filter.or[1].value = deviceId;
    updateAccessTokenQuery.filter.or[2].value = host;
  } else {
    updateAccessTokenQuery.filter.or[0].and[0].value = userId;
    updateAccessTokenQuery.filter.or[0].and[1].value = deviceId;
    updateAccessTokenQuery.filter.or[0].and[2].value = host;
  }
  common.executeQuery(updateAccessTokenQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 *
 * @param  {string}   userId
 * @param  {string}   token
 * @param  {string}   expiryDateTime
 * @param  {string}   deviceId
 * @param  {string}   host
 * @param  {Function} cb
 * @return {object}
 */
var createAccessToken = function (userId, token, expiryDateTime, deviceId, host, cb) {
  debug("user.DAL -> accessTokenGenerate");
  var insertAccessTokenQuery = common.cloneObject(query.insertAccessTokenQuery);
  var dbExpiryDateTime = d3.timeFormat(dbDateFormat)(new Date(expiryDateTime));
  insertAccessTokenQuery.insert.fValue = [userId, token, dbExpiryDateTime, deviceId, host];
  common.executeQuery(insertAccessTokenQuery, cb);
};


/**
 * Created By: CBT
 * Updated By: CBT
 *
 *
 * @param  {string}   deviceId
 * @param  {string}   deviceType
 * @param  {Function} cb
 * @return {object}
 */
var checkUserTransaction = function (deviceId, deviceType, cb) {
  debug("user.DAL -> checkUserTransaction");
  var checkUserTransactionQuery = common.cloneObject(query.checkUserTransactionQuery);
  checkUserTransactionQuery.filter.and[0].value = deviceId;
  checkUserTransactionQuery.filter.and[1].value = deviceType;
  common.executeQuery(checkUserTransactionQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 *
 * @param  {string}   deviceId
 * @param  {string}   deviceType
 * @param  {array}   fieldValue
 * @param  {Function} cb
 * @return {object}
 */
var updateUserTransaction = function (deviceId, deviceType, fieldValue, cb) {
  debug("user.DAL -> updateUserTransaction");
  var updateUserTransactionQuery = common.cloneObject(query.updateUserTransactionQuery);
  updateUserTransactionQuery.filter.and[0].value = deviceId;
  updateUserTransactionQuery.filter.and[1].value = deviceType;
  updateUserTransactionQuery.update = fieldValue;
  common.executeQuery(updateUserTransactionQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 *
 * @param  {string}   deviceId
 * @param  {string}   deviceType
 * @param  {Function} cb
 * @return {object}
 */
var createUserTransaction = function (deviceId, deviceType, cb) {
  debug("user.DAL -> createUserTransaction");
  var insertUserTransactionQuery = common.cloneObject(query.insertUserTransactionQuery);
  insertUserTransactionQuery.insert.fValue = [deviceId, deviceType];
  common.executeQuery(insertUserTransactionQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 *
 *
 * @param  {string}   userId
 * @param  {string}   deviceId
 * @param  {string}   host
 * @param  {Function} cb
 * @return {object}
 */
var exprieAccessToken = function (userId, deviceId, host, cb) {
  debug("user.DAL -> exprieAccessToken");
  var updateAccessTokenQuery = common.cloneObject(query.updateAccessTokenQuery);
  if (userId === undefined) {
    updateAccessTokenQuery.filter.or[1].value = deviceId;
    updateAccessTokenQuery.filter.or[2].value = host;
  } else {
    updateAccessTokenQuery.filter.or[0].and[0].value = userId;
    updateAccessTokenQuery.filter.or[0].and[1].value = deviceId;
    updateAccessTokenQuery.filter.or[0].and[2].value = host;
  }
  common.executeQuery(updateAccessTokenQuery, cb);
};


/**
 * Created By: CBT
 * Updated By: CBT
 * [validateUser description]
 * @param  {String}   userId   [description]
 * @param  {String}   password [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
var validateUser = function (userId, password, cb) {
  debug("user.DAL -> checkUserIsExist");
  var validateUserQuery = common.cloneObject(query.validateUserQuery);
  validateUserQuery.filter.and[0].value = userId;
  validateUserQuery.filter.and[1].value = password;
  common.executeQuery(validateUserQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [updateUserInfoById description]
 * @param  {String}   userId   [description]
 * @param  {[Array of object]}   fieldValue [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
var updateUserInfoById = function (userId, fieldValue, cb) {
  debug("user.DAL -> updateUserInfoById");
  var updateUserQuery = common.cloneObject(query.updateUserQuery);
  updateUserQuery.filter.or[1].value = userId;
  updateUserQuery.update = fieldValue;
  common.executeQuery(updateUserQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [checkUserIdIsValid description]
 * @param  {string}   userID [description]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
var checkUserIdIsValid = function (userID, cb) {
  debug("user.DAL -> checkUserIdIsValid");
  var checkUserIdIsValidQuery = common.cloneObject(query.checkUserIdIsValidQuery);
  checkUserIdIsValidQuery.filter.value = userID;
  common.executeQuery(checkUserIdIsValidQuery, cb);
}


/**
 * Created By: CBT
 * Updated By: CBT
 * [getUserByUserType description]
 * @param  {string}   userType [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var getUserByUserType = function (userType, cb) {
  debug("user.DAL -> getUserByUserType");
  var getUserByUserTypeQuery = common.cloneObject(query.getUserByUserTypeQuery);
  if(userType==-1){
   getUserByUserTypeQuery.filter.operator = "NOTEQ";
   getUserByUserTypeQuery.filter.value = userType;
  }else{
   getUserByUserTypeQuery.filter.operator = "EQ";
   getUserByUserTypeQuery.filter.value = userType;
  }
  common.executeQuery(getUserByUserTypeQuery, cb);
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [checkOTPLimit description]
 * @param  {string}   countryCode [description]
 * @param  {string}   mobile      [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
var checkOTPLimit = function (countryCode, mobile, cb) {
  debug("user.DAL -> checkOTPLimit");
  var checkOTPLimitQuery = common.cloneObject(query.checkOTPLimitQuery);
  var currDate = new Date();
  var startDate = d3.timeFormat(dbDateFormat)(DateLibrary.getRelativeDate(currDate, {
    operationType: "First_Date",
    granularityType: "Days"
  }));
  var endDate = d3.timeFormat(dbDateFormat)(DateLibrary.getRelativeDate(currDate, {
    operationType: "Last_Date",
    granularityType: "Days"
  }));
  checkOTPLimitQuery.filter.and[0].value = countryCode;
  checkOTPLimitQuery.filter.and[1].value = mobile;
  checkOTPLimitQuery.filter.and[2].value = startDate;
  checkOTPLimitQuery.filter.and[3].value = endDate;
  common.executeQuery(checkOTPLimitQuery, cb);
};


/**
 * Created By: CBT
 * Updated By: CBT
 * [exprieOTP description]
 * @param  {string}   countryCode [description]
 * @param  {string}   mobile      [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
var exprieOTP = function (countryCode, mobile, cb) {
  debug("user.DAL -> exprieOTP");
  var updateOTPQuery = common.cloneObject(query.updateOTPQuery);
  updateOTPQuery.filter.and[0].value = countryCode;
  updateOTPQuery.filter.and[1].value = mobile;
  common.executeQuery(updateOTPQuery, cb);
};


/**
 * Created By: CBT
 * Updated By: CBT
 * [saveOTP description]
 * @param  {string}   countryCode    [description]
 * @param  {string}   mobile         [description]
 * @param  {string}   OTP            [description]
 * @param  {string}   expiryDateTime [description]
 * @param  {Function} cb             [description]
 * @return {[type]}                  [description]
 */
var saveOTP = function (countryCode, mobile, OTP, expiryDateTime, cb) {
  debug("user.DAL -> saveOTP");
  var saveOTPQuery = common.cloneObject(query.saveOTPQuery);
  var dbExpiryDateTime = d3.timeFormat(dbDateFormat)(new Date(expiryDateTime));
  saveOTPQuery.insert.fValue = [countryCode, mobile, OTP, dbExpiryDateTime];
  common.executeQuery(saveOTPQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [validOTP description]
 * @param  {string}   countryCode    [description]
 * @param  {string}   mobile         [description]
 * @param  {string}   currDateTime   [description]
 * @param  {Function} cb             [description]
 * @return {[type]}                  [description]
 */
var validOTP = function (countryCode, mobile, currDateTime, cb) {
  debug("user.DAL -> validOTP");
  var verifyOTPQuery = common.cloneObject(query.verifyOTPQuery);
  verifyOTPQuery.filter.and[0].value = countryCode;
  verifyOTPQuery.filter.and[1].value = mobile;
  verifyOTPQuery.filter.and[2].value = d3.timeFormat(dbDateFormat)(currDateTime);
  common.executeQuery(verifyOTPQuery, cb);
};
/**
 * Created By: CBT
 * Updated By: CBT
 * [updateUserInfoByCountryCodeAndMobile description]
 * @param  {string}   countryCode    [description]
 * @param  {string}   mobile         [description]
 * @param  {Function} cb             [description]
 * @return {[type]}                  [description]
 */
var updateUserInfoByCountryCodeAndMobile = function (countryCode, mobile, fieldValue, cb) {
  debug("user.DAL -> updateUserInfoByCountryCodeAndMobile");
  var updateUserQuery = common.cloneObject(query.updateUserQuery);
  updateUserQuery.filter.or[0].and[0].value = countryCode;
  updateUserQuery.filter.or[0].and[1].value = mobile;
  updateUserQuery.update = fieldValue;
  common.executeQuery(updateUserQuery, cb);
};
/**
 * Created By: CBT
 * Updated By: CBT
 * [getUserInfoByCountryCodeAndMobile description]
 * @param  {string}   countryCode    [description]
 * @param  {string}   mobile         [description]
 * @param  {Function} cb             [description]
 * @return {[type]}                  [description]
 */
var getUserInfoByCountryCodeAndMobile = function (countryCode, mobile, cb) {
  debug("user.DAL -> getUserInfoByCountryCodeAndMobile");
  var getUserInfoQuery = common.cloneObject(query.getUserInfoQuery);
  getUserInfoQuery.filter.and[1].or[0].and[0].value = countryCode;
  getUserInfoQuery.filter.and[1].or[0].and[1].value = mobile;
  common.executeQuery(getUserInfoQuery, cb);
};


/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoles description]
 * @param  {string}   userID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var getRole = function(roleId,userTypeId,cb){
  debug("user.DAL -> getRole");
  var getRoleQuery = common.cloneObject(query.getRoleQuery);
  var roleFilter = {and: []}
  if(roleId > 0)
  {
    roleFilter.and.push({
      table:"RM",
      field: 'pk_RoleID',
      operator: 'EQ',
      value: roleId
    });
  }
  if(userTypeId > 0)
  {
    roleFilter.and.push({
      table:"RM",
      field: 'fk_userTypeID',
      operator: 'EQ',
      value: userTypeId
    });
  }
  if(roleId < 0 && userTypeId < 0){
      delete getRoleQuery.filter
  }else{
      getRoleQuery.filter = roleFilter;
  }
  common.executeQuery(getRoleQuery, cb);
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeUser description]
 * @param  {string}   userID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var removeUser = function(userID,cb){
  debug("user.DAL -> removeUser");
  var removeUserQuery = common.cloneObject(query.removeUserQuery);
  removeUserQuery.filter.value = userID;
  common.executeQuery(removeUserQuery, cb);
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [userLoginAdmin description]
 * @param  {string}   email      [description]
 * @param  {string}   password   [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var userLoginAdmin = function(email, password, cb) {
  debug("user.DAL -> userLogin admin");
  var getUserInfoQueryAdmin = common.cloneObject(query.getUserInfoQueryAdmin);
  getUserInfoQueryAdmin.filter.and[2].value = email;
  getUserInfoQueryAdmin.filter.and[3].value = password;
  common.executeQuery(getUserInfoQueryAdmin, cb);
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [getUserType description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var getUserType = function(cb){
  debug("user.DAL -> getUserType");
  var getuserTypeQuery = common.cloneObject(query.getUserTypeQuery);
  common.executeQuery(getuserTypeQuery, cb);
}
module.exports = {
  checkUserIsExist: checkUserIsExist,
  createUser: createUser,
  userLogin: userLogin,
  exprieAccessToken: exprieAccessToken,
  createAccessToken: createAccessToken,
  checkUserTransaction: checkUserTransaction,
  updateUserTransaction: updateUserTransaction,
  createUserTransaction: createUserTransaction,
  exprieAccessToken:exprieAccessToken,
  validateUser:validateUser,
  updateUserInfoById:updateUserInfoById,
  checkUserIdIsValid:checkUserIdIsValid,
  getUserByUserType:getUserByUserType,
  checkOTPLimit:checkOTPLimit,
  exprieOTP:exprieOTP,
  saveOTP:saveOTP,
  validOTP:validOTP,
  updateUserInfoByCountryCodeAndMobile:updateUserInfoByCountryCodeAndMobile,
  getUserInfoByCountryCodeAndMobile:getUserInfoByCountryCodeAndMobile,
  getRole:getRole,
  removeUser:removeUser,
  userLoginAdmin:userLoginAdmin,
  getUserType:getUserType,
}
