var debug = require('debug')('server:api:v1:category:controller');
var categoryService = require('./category.service');
var constant = require('../constant');

/**
 * Created By: CBT
 * Updated By: CBT
 * [addUpdateCategory description]
 * @param {[type]} request  [description]
 * @param {[type]} response [description]
 */
var addUpdateCategory = function (request, response) {
  debug("category.controller -> add category");
  if (request.session.userInfo !== undefined) {
    if (Object.keys(request.body).length != 0 && typeof request.body === "object") {
      categoryService.addUpdateCategoryService(request, function (result) {
        return response.send(result);
      })
    } else {
      return response.send({
        status: false,
        error: constant.requestMessages.ERR_INVALID_CATEGORY_ADD_REQUEST
      });
    }
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};

/**
 * [getCategory description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var getCategory = function (request, response) {
  debug("category.controller -> get category");
  if (request.session.userInfo !== undefined) {
    categoryService.getCategoryService(request, function (result) {
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};




/**
 * Created By: CBT
 * Updated By: CBT
 * [deleteCategory description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var deleteCategory = function (request, response) {
  debug("category.controller -> delete category");
  if (request.session.userInfo !== undefined && request.params !== undefined) {
    categoryService.deleteCategoryService(request, function (result) {
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};



module.exports = {
  addUpdateCategory: addUpdateCategory,
  getCategory: getCategory,
  deleteCategory: deleteCategory,
};
