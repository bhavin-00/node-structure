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
var addUpdateCategoryService = async function (request, response) {
  debug("category.service -> updateCategoryService", request.body);
  var isValidObject = common.validateObject([request.body]);
  var isValid = common.validateParams([request.body.category_name,request.body.category_id,request.body.country_code,request.body.number,request.body.password]);
  if(!isValidObject){
    return common.sendResponse(response,constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST,false);
  }
  else if(!isValid){
    return common.sendResponse(response,constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST,false);
  }

  var categoryID = request.body.category_id;
  var userID = request.session.userInfo.userId;
  var categoryName = request.body.category_name;
  var description = request.body.description;
  var imageObj = request.body.imageObj;
  var image = '';

  var fileObj = imageObj;

  try{
  if (fileObj != undefined && Object.keys(fileObj).length > 0) {

    var result = await otherService.imageUploadMoving(fileObj, constant.appConfig.MEDIA_MOVING_PATH.CATEGORY);
    image = result.data.file;
  }

  await addUpdateCategory(categoryID, userID, categoryName, description, image, request,response)

  }
  catch(ex){
    return common.sendResponse(response,constant.userMessages.MSG_ERROR_IN_QUERY,false);
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
async function addUpdateCategory(categoryID, userID, categoryName, description, image, request,response) {
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
  try{
  if (categoryID <= 0) {
    debug("resulted final Add category object -> ", fieldValueInsert);
    let result = await categoryDAL.checkCategoryIsExist(categoryinfo.category)

    if (result.status === true && result.content.length != 0) {
      return common.sendResponse(response, constant.categoryMessages.ERR_CATEGORY_EXIST,false);
    }
    if (result.status == true && result.content.length === 0) {
     let res_create_cat = await categoryDAL.createCategory(fieldValueInsert)
     return common.sendResponse(response, constant.categoryMessages.CATEGORY_ADD_SUCCESS,true);
    }
  } else {
    modifiedObj = {
      field: "modifiedDate",
      fValue: d3.timeFormat(dbDateFormat)(new Date())
    }


    let result = await categoryDAL.checkCategoryIDValid(categoryID);


    if (result.content.length === 0) {
      return common.sendResponse(response, constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_UPDATE,false);
    }
    if (result.content[0].imageName != "" && result.content[0].imageName != undefined && fieldValueInsert[3].fValue == "")
        fieldValueInsert[3].fValue = result.content[0].imageName;

      fieldValueInsert.push(modifiedObj);

      debug("resulted final Update category object -> ", fieldValueInsert);

      let res_update_cate = await categoryDAL.updateCategory(fieldValueInsert, categoryID);
      return common.sendResponse(response, constant.categoryMessages.CATEGORY_UPDATE_SUCCESS,true);
  }
}
catch(ex){
  throw  ex;
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
var getCategoryService = async function (request, response) {
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
      return common.sendResponse(response, constant.categoryMessages.INVALID_ACTIVE_PARAM,false);
    }
  }
  try{
    let result = await categoryDAL.getCategory(categoryID, activeStatus, dbServerDateTime, limit);
    var fullUrl = common.getGetMediaURL(request);

    result.content.forEach(function (category) {
      if (category.image_name != undefined && category.image_name != "") {
        category.image_name = common.getGetMediaURL(request) + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY + "large/" + category.image_name;
      } else {
        category.image_name = common.getNoImageURL(request);
      }
    });
    return common.sendResponse(response, result.content,true);

  }
  catch(ex){
    debug(ex);
    return common.sendResponse(response, constant.categoryMessages.ERR_NO_CATEGORY_FOUND,false);
  }

};



/**
 * Created By: CBT
 * Updated By: CBT
 * [deleteCategoryService description]
 * @param  {[type]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var deleteCategoryService = async function (request, response) {
  debug("Category.service -> deleteCategoryService", request.params.categoryID);

  let isValid = common.validateParams([request.params.categoryID])
  if(!isValid){
      return common.sendResponse(response,constant.categoryMessages.ERR_INVALID_CATEGORY_DELETE_REQUEST,false);
  } else {
    try{
        var categoryID = request.params.categoryID;

        let result = await categoryDAL.checkCategoryIDValid(categoryID);
        if (result.content.length === 0) {
          return common.sendResponse(response,constant.categoryMessages.ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE,false);
        }
        let res_remove_cat = await categoryDAL.removeCategory(categoryID);
        return common.sendResponse(response,constant.categoryMessages.MSG_CATEGORY_REMOVE_SUCCESSFULLY,true);
    }
    catch(ex){
      return common.sendResponse(response,constant.userMessages.MSG_ERROR_IN_QUERY,false);
    }
  }
};



module.exports = {
  addUpdateCategoryService: addUpdateCategoryService,
  getCategoryService: getCategoryService,
  deleteCategoryService: deleteCategoryService,
};
