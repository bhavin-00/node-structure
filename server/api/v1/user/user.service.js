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
var signupService = function (request, cb) {
    debug("user.service -> signupService");
    if (request.body.name == undefined || request.body.name == "" || request.body.email == undefined || request.body.email == "" || request.body.country_code == undefined || request.body.country_code == "" || request.body.number == undefined || request.body.number == "" || request.body.password == undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST
        });
        return;
    }

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

    userDAL.checkUserIsExist(userinfo.countryCode, userinfo.mobile,userinfo.email, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length > 0) {
            var userInfo = result.content[0];
            if (userInfo.is_active == false) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_NOT_ACTIVE
                });
            } else if (userInfo.is_verify == true) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_ALREADY_EXIST
                });
            }
            return;
        }
        userDAL.createUser(userfieldValueInsert, function (result) {
            if (result.status === false) {
                cb(result);
            } else {
                cb({
                    status: true,
                    data: constant.userMessages.MSG_SIGNUP_SUCCESSFULLY
                });
            }
        });
    });
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
var signinService = function (request, cb) {
    debug("user.service -> signinService");
    if (request.body.user_name == undefined || request.body.user_name == "" || request.body.password == undefined || request.body.password == "") {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
        return;
    } else if (request.body.user_name.indexOf("@") > 0 && request.body.user_name.lastIndexOf(".") > request.body.user_name.indexOf("@") + 2 && request.body.user_name.lastIndexOf(".") + 2 <= request.body.user_name.length) {
        var email = request.body.user_name;
    } else if (request.body.user_name.match(/\d+/g) != null && request.body.user_name.match(/\d+/g)[0].length == 10) {
        var mobile = request.body.user_name;
    } else {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
        return;
    }
    var countryCode = "+91";
    var password = md5(request.body.password);
    userDAL.userLogin(countryCode, mobile, password, email, function (result) {
        if (result.status === false) {
            cb(result);
        } else if (result.content.length === 0) {
            cb({
                status: false,
                error: constant.userMessages.ERR_INVALID_MOBILE_AND_PASSWORD
            });
        } else {
            checkAndCreateAccessToken(request, result.content, function (res) {
                cb(res);
            });
        }
    }); // userLogin end
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
function checkAndCreateAccessToken(request, userInfo, cb) {
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

    userDAL.exprieAccessToken(userId, deviceId, host, function (result) {
        if (result.status === false) {
            cb(result);
        } else {
            debug('11111111111111111111111111111111111111', userId, token, expiryDateTime, deviceId, host);
            userDAL.createAccessToken(userId, token, expiryDateTime, deviceId, host, function (result) {
                debug('222222222222222222222222222222222222222222', result);
                if (result.status === false) {
                    cb(result);
                } else {
                    userDAL.checkUserTransaction(deviceId, deviceType, function (result) {
                        if (result.status === false) {
                            cb(result);
                        } else if (result.content[0].totalCount > 0) {
                            var fieldValueUpdate = [];
                            fieldValueUpdate.push({
                                field: "isLogedIn",
                                fValue: 1
                            });
                            fieldValueUpdate.push({
                                field: "lastLoginDatetime",
                                fValue: d3.timeFormat(dbDateFormat)(new Date())
                            });
                            userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate, function (result) {
                                if (result.status === false) {
                                    cb(result);
                                } else {
                                    cb({
                                        status: true,
                                        "access_token": token,
                                        data: userInfo
                                    });
                                }
                            }); // updateUserTransaction end
                        } else if (result.content[0].totalCount == 0) {
                            userDAL.createUserTransaction(deviceId, deviceType, function (result) {
                                if (result.status === false) {
                                    cb(result);
                                } else {
                                    cb({
                                        status: true,
                                        "access_token": token,
                                        data: userInfo
                                    });
                                }
                            }); // createUserTransaction end
                        }
                    }); // checkUserTransaction end
                }
            }); // createAccessToken end
        }
    }); // exprieAccessToken end
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
var signoutService = function (request, cb) {
  debug("user.service -> signoutService");
  var deviceId = request.headers["udid"];
  var userId = request.session.userInfo.userId;
  var deviceType = request.headers["device-type"];
  var host = request.hostname;
  userDAL.exprieAccessToken(userId, deviceId, host, function (result) {
    request.session.destroy();
    if (result.status === false) {
      cb({
        status: false,
        error: constant.userMessages.ERR_SIGNOUT_IS_NOT_PROPER
      });
    } else {
      var fieldValueUpdate = [];
      fieldValueUpdate.push({
        field: "isLogedIn",
        fValue: "0"
      });
      userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate, function (result) {
        if (result.status === false) {
          cb({
            status: false,
            error: constant.userMessages.ERR_SIGNOUT_IS_NOT_PROPER
          });
        } else {
          cb({
            status: true,
            data: constant.userMessages.MSG_SIGNOUT_SUCCESSFULLY
          });
        }
      });
    }
  });
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
var changePasswordService = function (request, cb) {
  debug("user.service -> changePasswordService");
  if (request.body.old_password === undefined || request.body.old_password === "" || request.body.new_password === undefined || request.body.new_password === "" || request.body.retype_password === undefined || request.body.retype_password === "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CHANGE_PASSWORD_REQUEST
    });
    return;
  }
  if (request.body.new_password != request.body.retype_password) {
    cb({
      status: false,
      error: constant.userMessages.ERR_PASSWORD_NOT_MATCH
    });
    return;
  }

  var userId = request.session.userInfo.userId;
  var oldPassword = md5(request.body.old_password);
  var newPassword = md5(request.body.retype_password);
  userDAL.validateUser(userId, oldPassword, function (result) {
    if (result.status === false) {
      cb(result);
      return;
    } else if (result.content.length == 0 || result.content[0].totalCount == 0) {
      cb({
        status: false,
        error: constant.userMessages.ERR_OLD_PASSWORD_NOT_MATCH
      });
      return;
    }
    var fieldValueUpdate = [];
    fieldValueUpdate.push({
      field: "password",
      fValue: newPassword
    });
    userDAL.updateUserInfoById(userId, fieldValueUpdate, function (result) {
      if (result.status === false) {
        cb(result);
      } else {
        cb({
          status: true,
          data: constant.userMessages.MSG_PASSWORD_CHANGE_SUCCESSFULLY
        });
      }
    }); // updateUserInfoById end
  }); // validateUser end
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
var forgotPasswordService = function (request, cb) {
  debug("user.service -> forgotPasswordService");
  if (request.body.user_id === undefined || request.body.user_id == "" || request.body.new_password === undefined || request.body.new_password == "" || request.body.retype_password === undefined || request.body.retype_password == "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_FORGOT_PASSWORD_REQUEST
    });
    return;
  }
  if (request.body.new_password != request.body.retype_password) {
    cb({
      status: false,
      error: constant.userMessages.ERR_PASSWORD_NOT_MATCH
    });
    return;
  }

  var user_id = request.body.user_id;
  var password = md5(request.body.retype_password);

  userDAL.checkUserIdIsValid(user_id, function (result) {
    if (result.status === false) {
      cb(result);
    } else if (result.content.length === 0) {
      cb({
        status: false,
        error: constant.userMessages.ERR_USER_NOT_EXIST
      });
    } else {
      var fieldValueUpdate = [];
      fieldValueUpdate.push({
        field: "password",
        fValue: password
      });
      userDAL.updateUserInfoById(user_id, fieldValueUpdate, function (result) {
        if (result.status === false) {
          cb(result);
        } else {
          cb({
            status: true,
            data: constant.userMessages.MSG_PASSWORD_CHANGE_SUCCESSFULLY
          });
        }
      });
    }
  });

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
var getUserListService = function (request, cb) {
  if (request.params.user_type == "" || request.params.user_type == undefined) {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_REQUEST_GET_USER_LIST
    })
    return;
  }
  var userType = request.params.user_type;
  userDAL.getUserByUserType(userType, function (result) {
    if (result.status == false) {
      cb({
        status: false,
        error: constant.requestMessages.ERR_UNABLE_TO_GET_USER_LIST
      })
      return;
    }
    cb({ status: true, data: result.content });
  })
}


/**
 * Created By: CBT
 * Updated By: CBT
 * [sendOTPService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var sendOTPService = function (request, cb) {
  debug("user.service -> sendOTPService");
  if (request.body.mobile === undefined || request.body.mobile == "" || request.body.country_code === undefined || request.body.country_code == "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_SEND_OTP_REQUEST
    });
    return;
  }
  var mobile = request.body.mobile;
  var countryCode = request.body.country_code;
  userDAL.checkUserIsExist(countryCode, mobile,null, function (result) {
    if (result.status === false) {
      cb(result);
    } else if (result.content.length === 0) {
      cb({
        status: false,
        error: constant.userMessages.ERR_USER_NOT_EXIST
      });
      return;
    }
    sendOTP(countryCode, mobile, cb);
  });
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
function sendOTP(countryCode, mobile, cb) {
  debug("user.service -> sendOTP");
  userDAL.checkOTPLimit(countryCode, mobile, function (result) {
    if (result.status === false) {
      cb(result);
      return;
    } else if (result.content.length > 0 && result.content[0].totalCount >= constant.appConfig.MAX_OTP_SEND_LIMIT) {
      cb({
        status: false,
        error: constant.userMessages.ERR_OTP_LIMIT_EXCEEDED
      });
      return;
    }
    userDAL.exprieOTP(countryCode, mobile, function (result) {
      if (result.status === false) {
        cb(result);
        return;
      }
      var OTP = randomstring.generate(constant.appConfig.OTP_SETTINGS);
      var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
        operationType: "Absolute_DateTime",
        granularityType: "Seconds",
        value: constant.appConfig.MAX_OTP_EXPIRY_SECONDS
      });
      userDAL.saveOTP(countryCode, mobile, OTP, expiryDateTime, function (result) {
        if (result.status === false) {
          cb(result);
          return;
        } else {
          var OTP_SENT_MSG_OBJ = common.cloneObject(constant.userMessages.MSG_OTP_SENT_SUCCEFULLY);
          OTP_SENT_MSG_OBJ.message = OTP_SENT_MSG_OBJ.message.replace("{{mobile}}", mobile.replace(/\d(?=\d{4})/g, "*"));
          // HACK remove below line when SMS flow implement
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
          }
          cb({
            status: true,
            data: OTP_SENT_MSG_OBJ
          });
        }
      }); // saveOTP end
    }); // exprieOTP end
  }); // checkOTPLimit end
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
var verifyOTPService = function (request, cb) {
  debug("user.service -> verifyOTPService");
  if (request.body.mobile === undefined || request.body.country_code === undefined || request.body.otp === undefined) {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST
    });
    return;
  }
  var mobile = request.body.mobile;
  var countryCode = request.body.country_code;
  var OTP = request.body.otp;
  verifyOTP(countryCode, mobile, OTP, cb);
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

function verifyOTP(countryCode, mobile, OTP, cb) {
  debug("user.service -> verifyOTP");
  var currDateTime = new Date();
  userDAL.validOTP(countryCode, mobile, currDateTime, function (result) {
    if (result.status === false) {
      cb(result);
      return;
    } else if (result.content.length === 0) {
      // OTP is Expire
      cb({
        status: false,
        error: constant.userMessages.ERR_OTP_IS_EXPIRED
      });
      return;
    } else if (result.content.length > 0) {
      var OTPobj = result.content[0];
      if (OTPobj.otp != OTP) {
        // Invalid OTP
        cb({
          status: false,
          error: constant.userMessages.ERR_OTP_INVALID
        });
        return;
      } else if (OTPobj.otp == OTP && new Date(OTPobj.expiry_datetime).getTime() < currDateTime.getTime()) {
        // OTP is Expire
        cb({
          status: false,
          error: constant.userMessages.ERR_OTP_IS_EXPIRED
        });
        return;
      }

      var filedValueUpdate = [{
        field: 'isVerified',
        fValue: 1
      }];

      userDAL.updateUserInfoByCountryCodeAndMobile(countryCode, mobile, filedValueUpdate, function (result) {
        if (result.status === false) {
          cb(result);
          return;
        }
        userDAL.exprieOTP(countryCode, mobile, function (result) {
          if (result.status === false) {
            cb(result);
            return;
          }
          // Get UserINFO
          userDAL.getUserInfoByCountryCodeAndMobile(countryCode, mobile, function (result) {
            if (result.status === false) {
              cb(result);
            } else if (result.content.length === 0) {
              cb({
                status: false,
                error: constant.userMessages.ERR_USER_NOT_EXIST
              });
            } else {
              cb({
                status: true,
                data: result.content[0]
              });
            }
          }); // getUserInfoByCountryCodeAndMobile end
        }); // exprieOTP end
      }); // updateUserInfoByCountryCodeAndMobile
    }
  }); // validOTP end
}


/**
 * Created By: CBT
 * Updated By: CBT
 * addUpdateAdminService
 * @param  {object}   request
 * @param  {Function} cb
 */
var addUpdateAdminService = function(request, cb) {
  debug("user.service -> addUpdateAdminService");
  if (request.body.user_id == undefined || request.body.user_id == "" || request.body.name == undefined || request.body.name == "" || request.body.email == undefined || request.body.email == "" || request.body.country_code == undefined || request.body.country_code == "" || request.body.mobile == undefined || request.body.mobile == "" || request.body.password == undefined || request.body.password == ""|| request.body.role_id == undefined || request.body.role_id == "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_ADD_UPDATE_REQUEST_OF_ADMIN_USER
    });
    return;
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
  userKeys.forEach(function(userKeys) {
    if (userinfo[userKeys] !== undefined) {
      var fieldValueObj = {};
      fieldValueObj = {
        field: userKeys,
        fValue: userinfo[userKeys]
      }
      userfieldValueInsert.push(fieldValueObj);
    }
  });


  userDAL.checkUserIsExist(userinfo.countryCode, userinfo.mobile,userinfo.email, function(result) {
    if (result.status === false) {
      cb(result);
      return;
    } else if (userID == -1 && result.content.length > 0) {
      cb({
        status: false,
        error: constant.userMessages.ERR_USER_IS_ALREADY_EXIST
      });
      return;
    }
    if (userID == -1) {
      userDAL.createUser(userfieldValueInsert, function(result) {
        if (result.status === false) {
          cb(result);
        } else {
          cb({
            status: true,
            content: constant.userMessages.MSG_ADMIN_SUCESSFULLY_CREATED
          });
        }
      });
    } else {
      if (result.content.length > 0 && result.content[0].user_id == userID) {
        userDAL.updateUserInfoById(userID, userfieldValueInsert, function(result) {
          if (result.status === false) {
            cb(result);
          } else {
            cb({
              status: true,
              content: constant.userMessages.MSG_ADMIN_SUCESSFULLY_UPDATED
            });
          }
        });
      }else if(result.content.length == 0){
         cb({
            status: false,
            error: constant.userMessages.ERR_USER_NOT_EXIST
          });
      } else {
         cb({
            status: false,
            error: constant.userMessages.ERR_USER_IS_ALREADY_EXIST
          });
      }
    }
  });
}
/**
 * Created By: CBT
 * Updated By: CBT
 * get admin service
 * @param  {object}   request
 * @param  {Function} cb
 */
var getAdminService = function(request, cb) {
  debug("user.service -> getAdminService");
  userDAL.getUserByUserType(constant.userType.admin, function(result) {
    if (result.status == false) {
      cb({
        status: false,
        error: result.error
      });
      return;
    }
    cb({
      status: true,
      data: result.content
    })
  })
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var getRoleService = function(request, cb) {
  debug("user.service -> getRoleService");
  if (request.params.role_id === undefined || request.params.user_type_id === undefined || request.params.role_id === 0 || request.params.user_type_id === 0) {
    cb({
      status: false,
      error: constant.userMessages.ERR_INVALID_GET_ROLE_REQUEST
    });
    return;
  } else {
    var roleID = request.params.role_id;
    var userTypeID = request.params.user_type_id;
    userDAL.getRole(roleID, userTypeID, function(result) {
      if (result.status === false) {
        cb(result);
        return
      }
      cb({
        status: true,
        data: result.content
      })
    });
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
var removeAdminService = function(request, cb) {
  debug("user.service -> removeAdminService");

  if (request.params.user_id === undefined) {
    cb({
      status: false,
      error: constant.userMessages.ERR_INVALID_USER_DELETE_REQUEST
    });
    return;
  } else {
    var userID = request.params.user_id;
    userDAL.removeUser(userID, function(result) {
      if (result.status === false) {
        cb(result);
        return
      }
      cb({
        status: true,
        data: constant.userMessages.MSG_USER_SUCESSFULLY_DELETED
      })
    });
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
var signinServiceAdmin = function(request, cb) {
  debug("user.service -> signin service admin");
  if (request.body.email === undefined || request.body.password === undefined) {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
    });
    return;
  }
  var email = request.body.email;
  var password = md5(request.body.password);
  userDAL.userLoginAdmin(email, password, function(result) {
    if (result.status === false) {
      cb(result);
    } else if (result.content.length === 0) {
      cb({
        status: false,
        error: constant.userMessages.ERR_INVALID_EMAIL_AND_PASSWORD
      });
    } else {
      checkAndCreateAccessToken(request, result.content, function(res) {
        cb(res);
      });
    }

  });
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleSegetUserTypeServicervice description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var getUserTypeService = function(request, cb) {
  debug("user.service -> getUserTypeService");
  userDAL.getUserType(function(result) {
    if (result.status === false) {
      cb(result);
      return
    }
    cb({
      status: true,
      data: result.content
    })
  });
}
module.exports = {
    signupService: signupService,
    signinService: signinService,
    signoutService:signoutService,
    changePasswordService:changePasswordService,
    forgotPasswordService:forgotPasswordService,
    getUserListService:getUserListService,
    sendOTPService:sendOTPService,
    verifyOTPService:verifyOTPService,
    addUpdateAdminService:addUpdateAdminService,
    getAdminService:getAdminService,
    getRoleService:getRoleService,
    removeAdminService:removeAdminService,
    signinServiceAdmin:signinServiceAdmin,
    getUserTypeService:getUserTypeService,
}
