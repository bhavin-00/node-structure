var debug = require('debug')('server:middleware');
var uuid = require('uuid');
var randomstring = require("randomstring");
var constant = require('../server/api/v1/constant');
var config = require('../config');
var common = require('../server/api/v1/common');

var checkRequestHeader = function(request, response, next) {
  debug("middleware -> checkRequestHeader");
  var api_key = request.headers["api-key"];
  var udid = request.headers["udid"];
  var device_type = request.headers["device-type"];
  if (api_key === undefined) {
    return common.sendResponse(response,constant.userMessages.ERR_API_KEY_NOT_FOUND,false);
  } else if (api_key != constant.appConfig.APPLICATION_API_KEY) {
    return common.sendResponse(response,constant.userMessages.ERR_INVALID_API_KEY,false);
  } else if (udid === undefined) {
    return common.sendResponse(response,constant.userMessages.ERR_UDID_NOT_FOUND,false);
  } else if (device_type === undefined) {
    return common.sendResponse(response,constant.userMessages.ERR_DEVICE_TYPE_NOT_FOUND,false);
  }
  next();
};

var logger = async function(request, response, next) {
  var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
  var userId = -1;
  if (request.session.userInfo !== undefined) {
    userId = request.session.userInfo.userId;
  }

  var type = request.method;
  var headers = JSON.stringify(request.headers);
  var body = JSON.stringify(request.body);
  var params = JSON.stringify(request.params);
  var query = JSON.stringify(request.query);
  var ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
  debug("requested ipAddress: ", ipAddress);
  debug("request HTTP method: ", type);
  debug("request headers: ", headers);
  debug("request body: ", body);
  debug("request params: ", params);
  debug("request query: ", query);
  debug("request URL: ", fullUrl);
  debug("requested userID: ", userId);
  if (config.isLogger === true) {
    var jsonQuery = {
      table: "tbl_Logger",
      insert: {
        field: ["type", "URL", "headers", "body", "params", "query", "fk_userID", "ipAddress"],
        fValue: [type, fullUrl, headers, body, params, query, userId, ipAddress]
      }
    };

    try{
        var result = await common.executeQuery(jsonQuery);
        next();
    }
    catch(ex){
      return common.sendResponse(response,{code: 9000,message:constant.userMessages.MSG_ERROR_IN_QUERY},false);
    }
  }else{
    next();
  }

};

var checkAccessToken = async function(request, response, next) {
  debug("middleware -> checkAccessToken");
  var accessToken = request.headers["authorization"];
  var udid = request.headers["udid"];
  if (accessToken === undefined && request.method === "GET") {
    if (request.session.userInfo === undefined) {
      request.session.userInfo = {
        accessToken: uuid.v1(),
        userId: '-1',
        name: 'Guest' + randomstring.generate({
          "length": 4,
          "charset": 'numeric'
        }),
        mobile: '9XXXXXXXXX',
        userRights:[]
      };
    }
    debug("Guest Session: ", request.session.userInfo);
    next();
    return;
  }
  if (accessToken === undefined) {
    response.statusCode = 401;
    return common.sendResponse(response,{code: 401,message: "Unauthorized access"},false);
  } else {
    var jsonQuery = {
      table: "view_AccessToken",
      select: [{
        field: 'userId',
        alias: 'user_id'
      }, {
        field: 'name',
      }, {
        field: 'mobile',
      }, {
        field: 'role',
        alias: 'role'
      }, {
        field: 'userTypeID',
        alias: 'user_type_id'
      }, {
        field: 'moduleName',
        alias: 'module_name'
      }, {
        field: 'canView',
        alias: 'can_view'
      }, {
        field: 'canAddEdit',
        alias: 'can_add_edit'
      }, {
        field: 'canDelete',
        alias: 'can_delete'
      }, {
        field: 'IFNULL(adminCreated,"")',
        encloseField: false,
        alias: 'admin_created'
      }],
      filter: {
        and: [{
          field: 'deviceId',
          operator: 'EQ',
          value: udid
        }, {
          field: 'token',
          operator: 'EQ',
          value: accessToken
        }]
      }
    };

    try{
        var result = await common.executeQuery(jsonQuery);
        if (result.content.length === 0) {
          return common.sendResponse(response,{code: 401,message: "Unauthorized access"},false);
        }
        if (request.session.userInfo === undefined) {
          request.session.userInfo = {
            accessToken: accessToken,
            userId: result.content[0].user_id,
            name: result.content[0].name,
            mobile: result.content[0].mobile,
            role: result.content[0].role,
            userTypeID: result.content[0].user_type_id
          };
          var userRights = [];
          for (var i = 0; i < result.content.length; i++) {
            var objRights = {};
            objRights.moduleName = result.content[i].module_name;
            objRights.canView = result.content[i].can_view;
            objRights.canAddEdit = result.content[i].can_add_edit;
            objRights.canDelete = result.content[i].can_delete;
            objRights.adminCreated = result.content[i].admin_created;
            userRights.push(objRights);
          }
          request.session.userInfo.userRights = userRights;
        } else {
          request.session.userInfo.role = result.content[0].role;
          request.session.userInfo.userTypeID = result.content[0].user_type_id;
        }
        debug("Session: ", request.session.userInfo);
        next();
    }
    catch(ex){
      return common.sendResponse(response,constant.userMessages.MSG_ERROR_IN_QUERY,false);
    }
  }
};


var userRightsByAPI = function(request, response, next) {
  var apiURL = request.url.split('/');

  if (request.session.userInfo == undefined) {
    return common.sendResponse(response,constant.userRightsByApiMessage.ERR_USER_INFO,false);
  } else {
    var role = request.session.userInfo.role;
    if (apiURL[1].indexOf('-') < 0) {
      next();
    } else {
      //Checking server side user rights for admin
      var action = apiURL[1].split('-')[0].toLowerCase();
      var moduleName = apiURL[1].split('-')[1].toLowerCase();
      var objRight = checkUserRights(request, moduleName);
      if (objRight.length > 0) {
        if ((action == "get" && objRight[0].canView == 1) || (action == "addupdate" && objRight[0].canAddEdit == 1) || (action == "remove" && objRight[0].canDelete == 1)) {
          next();
        } else {
          return common.sendResponse(response,constant.userRightsByApiMessage.ERR_USER_RIGHTS,false);
        }
      } else {
        return common.sendResponse(response,constant.userRightsByApiMessage.ERR_USER_RIGHTS,false);
      }

    }
  }
};

function checkUserRights(req, moduleName) {
  var userRights = req.session.userInfo.userRights;
  var objRight = userRights.filter(function(obj) {
    return moduleName.includes(obj.moduleName);
  })
  return objRight;
}

module.exports = {
  checkRequestHeader: checkRequestHeader,
  logger:logger,
  checkAccessToken:checkAccessToken,
  userRightsByAPI:userRightsByAPI
};
