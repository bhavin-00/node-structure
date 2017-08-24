var debug = require('debug')('server:api:v1:subcategory:service');
var uuid = require('uuid');
var common = require('../common');
var constant = require('../constant');
var subCategoryDAL = require('./subcategory.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");
var otherService = require('../other/other.service');
var otherDAL = require('../other/other.DAL');
var async = require('async');
var series = require('async/series');
// var storeService = require('../store/store.service');

/**
 * Created By: CBT
 * Updated By: CBT
 * [getSubCategoryService description]
 * @param  {[type]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var getSubCategoryService = function (request, cb) {
  debug("subcategory.service -> getSubCategoryService");

  var getPaginationObject = common.getPaginationObject(request);
  var dbServerDateTime = getPaginationObject.dbServerDateTime;
  var limit = getPaginationObject.limit;
  var pageNo = getPaginationObject.pageNo;
  var serverDateTime = getPaginationObject.serverDateTime

  var subCategoryID = request.params.subCategoryID;

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

  subCategoryDAL.getSubCategory(subCategoryID, activeStatus, dbServerDateTime, limit, function (result) {
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

var addUpdateSubCategoryService = function (request, cb) {
  debug("subcategory.service -> updateCategoryService", request.body);
  if (request.body.sub_category_id === undefined || request.body.sub_category_name === undefined || request.body.description === undefined || request.body.sub_category_name === "" || request.body.sub_category_id === "" || request.body.description === "") {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST
    });
    return;
  };
  var subCategoryId = request.body.sub_category_id;
  var categoryID = request.body.category_id;
  var createdBy = request.session.userInfo.userId;
  var subCategoryName = request.body.sub_category_name;
  var description = request.body.description;
  // var imageObj = request.body.imageObj;
  // var image = '';

  // var fileObj = imageObj;
  // if (fileObj != undefined && Object.keys(fileObj).length > 0) {

  //   otherService.imageUploadMoving(fileObj, constant.appConfig.MEDIA_MOVING_PATH.CATEGORY, function (result) {
  //     if (result.status === false) {
  //       cb(result);
  //       return;
  //     }
  //     image = result.data.file;
  //     addUpdateCategory(categoryID, userID, categoryName, description, image, request, function (data) {
  //       cb(data);
  //       return;
  //     });
  //   });
  // } else {
  //   addUpdateCategory(categoryID, userID, categoryName, description, image, request, function (data) {
  //     cb(data);
  //     return;
  //   });
  // }
  addUpdateSubCategory(subCategoryId, categoryID, createdBy, subCategoryName, description, request, function (data) {
    cb(data);
    return;
  });
};

function addUpdateSubCategory(subCategoryId, categoryID, createdBy, subCategoryName, description, request, cb) {
  var fullUrl = common.getGetMediaURL(request);
  var subcategory = {};
  // subcategory.pk_subCategoryId = subCategoryId;
  subcategory.fk_createdBy = createdBy;
  subcategory.subCategory = subCategoryName;
  subcategory.description = description;
  subcategory.fk_categoryId = categoryID;

  // if (image != '')
  //   subcategory.imageName = image; //   subcategory.imageName = fullUrl + image;
  // else
  //   subcategory.imageName = '';
  var subCategoryKeys = Object.keys(subcategory);
  var fieldValueInsert = [];
  subCategoryKeys.forEach(function (subcategoryKey) {
    if (subcategory[subcategoryKey] !== undefined) {
      var fieldValueObj = {};
      fieldValueObj = {
        field: subcategoryKey,
        fValue: subcategory[subcategoryKey]
      }
      fieldValueInsert.push(fieldValueObj);
    }
  });
  if (subCategoryId <= 0) {
    debug("resulted final Add sub category object -> ", fieldValueInsert);
    subCategoryDAL.checkSubCategoryIsExist(subcategory.subCategory, function (result) {
      if (result.status === true && result.content.length != 0) {
        cb({
          status: false,
          error: constant.categoryMessages.ERR_CATEGORY_EXIST,
        });
        return;
      }
      if (result.status == true && result.content.length === 0) {
        subCategoryDAL.createSubCategory(fieldValueInsert, function (result) {
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

    subCategoryDAL.checkSubCategoryIDValid(subCategoryId, function (result) {
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


      debug("resulted final Update category object -> ", fieldValueInsert);
      subCategoryDAL.updateSubCategory(fieldValueInsert, subCategoryId, function (result) {
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

var deleteSubCategoryService = function (request, cb) {
  debug("subategory.service -> deleteSubCategoryService", request.params.subCategoryID);

  if (request.params.subCategoryID === undefined) {
    cb({
      status: false,
      error: constant.requestMessages.ERR_INVALID_CATEGORY_DELETE_REQUEST
    });
    return;
  } else {
    var subCategoryID = request.params.subCategoryID;

    async.series([
      function (cb) { // Check sub category id is valid or not
        subCategoryDAL.checkSubCategoryIDValid(subCategoryID, (result) => {
          console.log(result);
          if (result.status === false || result.content.length === 0) {
            cb(constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE, null);
            return;
          }
          cb();
        });
      },

      function (cb) { // delete subcategory
        subCategoryDAL.removeSubCategory(subCategoryID, (result) => {
          if (result.status === false) {
            cb(result.error, null);
          } else {
            cb();
          }
        });
      }],
      function (err, result) {
        console.log(err);
        console.log(result);
        if (err) {
          cb({ status: false, error: err });
          return;
        }
        cb({
          status: true,
          data: constant.categoryMessages.MSG_CATEGORY_REMOVE_SUCCESSFULLY,
        })
      });

    // subCategoryDAL.checkSubCategoryIDValid(subCategoryID, function (result) {
    //   if (result.status === false) {
    //     cb(result);
    //     return;
    //   }
    //   if (result.content.length === 0) {
    //     cb({
    //       status: false,
    //       error: constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE
    //     });
    //     return;
    //   }

    //   subCategoryDAL.removeSubCategory(subCategoryID, function (result) {
    //     if (result.status === false) {
    //       cb(result);
    //       return
    //     }
    //     cb({
    //       status: true,
    //       data: constant.categoryMessages.MSG_CATEGORY_REMOVE_SUCCESSFULLY
    //     })
    //   });
    // });
  }
};

module.exports = {
  getSubCategoryService: getSubCategoryService,
  addUpdateSubCategoryService: addUpdateSubCategoryService,
  deleteSubCategoryService: deleteSubCategoryService,
};
