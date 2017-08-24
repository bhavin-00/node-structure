var debug = require('debug')('server:api:v1:inventory:service');
var uuid = require('uuid');
var common = require('../common');
var constant = require('../constant');
var categoryDAL = require('./category.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");
var otherService = require('../other/other.service');
var otherDAL = require('../other/other.DAL');
// var storeService = require('../store/store.service');

/**
 * Created By: CBT
 * Updated By: CBT
 * [addUpdateCategoryService description]
 * @param {[type]}   request [description]
 * @param {Function} cb      [description]
 */
var addUpdateCategoryService = function (request, cb) {
  debug("category.service -> updateCategoryService", request.body);
  if (request.body.category_name === undefined || request.body.category_id === undefined || request.body.category_id === "" || request.body.category_name === "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST
    });
    return;
  }
  var categoryID = request.body.category_id;
  var userID = request.session.userInfo.userId;
  var categoryName = request.body.category_name;
  var description = request.body.description;
  var imageObj = request.body.imageObj;
  var image = '';

  var fileObj = imageObj;
  if (fileObj != undefined && Object.keys(fileObj).length > 0) {

    otherService.imageUploadMoving(fileObj, constant.appConfig.MEDIA_MOVING_PATH.CATEGORY, function (result) {
      if (result.status === false) {
        cb(result);
        return;
      }
      image = result.data.file;
      addUpdateCategory(categoryID, userID, categoryName, description, image, request, function (data) {
        cb(data);
        return;
      });
    });
  } else {
    addUpdateCategory(categoryID, userID, categoryName, description, image, request, function (data) {
      cb(data);
      return;
    });
  }

};

/**
 * Created By: CBT
 * Updated By: CBT
 * [addUpdateCategory description]
 * @param {[type]}   categoryID       [description]
 * @param {[type]}   userID           [description]
 * @param {[type]}   categoryName     [description]
 * @param {[type]}   description      [description]
 * @param {[type]}   image            [description]
 * @param {[type]}   request          [description]
 * @param {Function} cb               [description]
 */
function addUpdateCategory(categoryID, userID, categoryName, description, image, request, cb) {
  var fullUrl = common.getGetMediaURL(request);
  var categoryinfo = {};
  categoryinfo.fk_createdBy = userID;
  categoryinfo.category = categoryName;
  categoryinfo.description = description;

  if (image != '')
    categoryinfo.imageName = image; //   categoryinfo.imageName = fullUrl + image;
  else
    categoryinfo.imageName = '';

  var categoryKeys = Object.keys(categoryinfo);
  var fieldValueInsert = [];
  categoryKeys.forEach(function (categoryKey) {
    if (categoryinfo[categoryKey] !== undefined) {
      var fieldValueObj = {};
      fieldValueObj = {
        field: categoryKey,
        fValue: categoryinfo[categoryKey]
      }
      fieldValueInsert.push(fieldValueObj);
    }
  });
  if (categoryID <= 0) {
    debug("resulted final Add category object -> ", fieldValueInsert);
    categoryDAL.checkCategoryIsExist(categoryinfo.category, function (result) {
      if (result.status === true && result.content.length != 0) {
        cb({
          status: false,
          error: constant.categoryMessages.ERR_CATEGORY_EXIST,
        });
        return;
      }
      if (result.status == true && result.content.length === 0) {
        categoryDAL.createCategory(fieldValueInsert, function (result) {
          if (result.status === false) {
            cb(result);
          } else {
            cb({
              status: true,
              data: constant.categoryMessages.CATEGORY_ADD_SUCCESS,
              category_id: result.content.insertId
            });
          }
        });
      }

    });

  } else {
    modifiedObj = {
      field: "modifiedDate",
      fValue: d3.timeFormat(dbDateFormat)(new Date())
    }
    categoryDAL.checkCategoryIDValid(categoryID, function (result) {
      if (result.status === false) {
        cb(result);
        return;
      }
      if (result.content.length === 0) {
        cb({
          status: false,
          error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_UPDATE
        });
        return;
      }
      if (result.content[0].imageName != "" && result.content[0].imageName != undefined && fieldValueInsert[3].fValue == "")
        fieldValueInsert[3].fValue = result.content[0].imageName;

      fieldValueInsert.push(modifiedObj);
      debug("resulted final Update category object -> ", fieldValueInsert);
      categoryDAL.updateCategory(fieldValueInsert, categoryID, function (result) {
        if (result.status === false) {
          cb(result);
        } else {
          cb({
            status: true,
            data: constant.categoryMessages.CATEGORY_UPDATE_SUCCESS
          });
        }
      });

    });
  }
}
/**
 * Created By: CBT
 * Updated By: CBT
 * [getCategoryService description]
 * @param  {[type]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var getCategoryService = function (request, cb) {
  debug("Category.service -> getCategoryService");

  var getPaginationObject = common.getPaginationObject(request);
  var dbServerDateTime = getPaginationObject.dbServerDateTime;
  var limit = getPaginationObject.limit;
  var pageNo = getPaginationObject.pageNo;
  var serverDateTime = getPaginationObject.serverDateTime
  var categoryID = request.params.categoryID;

  var activeStatus = 1;
  if (request.params.activeStatus != undefined && request.params.activeStatus != "") {
    if (constant.appConfig.VALID_ACTIVE_STATUS_PARAM.indexOf(request.params.activeStatus) > -1) {
      activeStatus = request.params.activeStatus;
    } else {
      cb({
        status: false,
        error: constant.otherMessage.INVALID_ACTIVE_PARAM
      });
      return;
    }
  }

  categoryDAL.getCategory(categoryID, activeStatus, dbServerDateTime, limit, function (result) {
    if (result.status == false) {
      cb({
        status: false,
        error: constant.categoryMessages.ERR_NO_CATEGORY_FOUND
      });
      return;
    } else {
      var fullUrl = common.getGetMediaURL(request);
      result.content.forEach(function (category) {


        if (category.image_name != undefined && category.image_name != "") {
          category.image_name = common.getGetMediaURL(request) + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY + "large/" + category.image_name;
        } else {
          category.image_name = common.getNoImageURL(request);
        }
      });
      cb({
        status: true,
        data: result.content
      });
    }
  });
};



/**
 * Created By: CBT
 * Updated By: CBT
 * [deleteCategoryService description]
 * @param  {[type]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var deleteCategoryService = function (request, cb) {
  debug("Category.service -> deleteCategoryService", request.params.categoryID);

  if (request.params.categoryID === undefined) {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CATEGORY_DELETE_REQUEST
    });
    return;
  } else {
    var categoryID = request.params.categoryID;
    // var userID = request.session.userInfo.userId;

    categoryDAL.checkCategoryIDValid(categoryID, function (result) {
      if (result.status === false) {
        cb(result);
        return;
      }
      if (result.content.length === 0) {
        cb({
          status: false,
          error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE
        });
        return;
      }

      categoryDAL.removeCategory(categoryID, function (result) {
        if (result.status === false) {
          cb(result);
          return
        }
        cb({
          status: true,
          data: constant.categoryMessages.MSG_CATEGORY_REMOVE_SUCCESSFULLY
        })
      });
    });
  }
};



module.exports = {
  addUpdateCategoryService: addUpdateCategoryService,
  getCategoryService: getCategoryService,
  deleteCategoryService: deleteCategoryService,
};
