var debug = require('debug')('server:api:v1:common');
var constant = require('./constant');
var queryExecutor = require('../../helper/mySql');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var pageSize = constant.appConfig.PAGE_SIZE;
var d3 = require("d3");

module.exports.cloneObject = function(obejct) {
  return JSON.parse(JSON.stringify(obejct));
};

module.exports.executeQuery = function(jsonQuery, cb) {
  queryExecutor.executeQuery(jsonQuery, function(result) {

    if (result.status === false && result.error.code === 10001) {
      cb({
        status: false,
        error: {
          code: 9001,
          message: "Error dublicate entry"
        }
      });
      return;
    } else if (result.status === false) {
      cb({
        status: false,
        error: {
          code: 9000,
          message: "Error in executeQuery"
        }
      });
      return;
    }
    cb(result);
  });
};

module.exports.executeQueryWithTransactions = function(jsonQueryJSONArray, cb) {
  queryExecutor.executeQueryWithTransactions(jsonQueryJSONArray, function(result) {
    if (result.status === false && result.error.code === 10001) {
      cb({
        status: false,
        error: {
          code: 9001,
          message: "Error dublicate entry"
        }
      });
      return;
    } else if (result.status === false) {
      cb({
        status: false,
        error: {
          code: 9000,
          message: "Error in executeQuery"
        }
      });
      return;
    }
    cb(result);
  });
};


module.exports.getGetMediaURL = function(request) {
  debug("common -> getGetMediaURL");
  var fullUrl = request.protocol + '://' + request.get('host') + constant.appConfig.MEDIA_GET_STATIC_URL;
  return fullUrl;
};

module.exports.getNoImageURL = function(request) {
  debug("common -> getGetMediaURL");
  var fullUrl = request.protocol + '://' + request.get('host') + constant.appConfig.MEDIA_DEFAULT_IMAGES_PATH + "noimage.jpg";
  return fullUrl;
};

module.exports.getPaginationObject = function(request) {
  var paginationObj = {};
  var serverDateTime;
  var pageNo;
  if (request.query.pageno === undefined || request.query.datetime === undefined) {
    pageNo = 1;
    serverDateTime = (new Date()).getTime();
  } else {
    pageNo = parseInt(request.query.pageno);
    serverDateTime = parseInt(request.query.datetime);
  }
  paginationObj.pageNo = pageNo;
  paginationObj.serverDateTime = serverDateTime;
  paginationObj.dbServerDateTime = d3.timeFormat(dbDateFormat)(new Date(serverDateTime));
  paginationObj.limit = [pageSize * (pageNo - 1), pageSize];
  return paginationObj;
};