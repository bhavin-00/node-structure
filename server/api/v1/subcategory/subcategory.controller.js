var debug = require('debug')('server:api:v1:subcategory:controller');
var subCategoryService = require('./subcategory.service');
var constant = require('../constant');

/**
 * [getSubCategory description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var getSubCategory = function (request, response) {
  if (request.session.userInfo !== undefined) {
    subCategoryService.getSubCategoryService(request, function (result) {
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_USERINFO
    });
  }
};

var addUpdateSubCategory = function (request, response) {
  debug("subcategory.controller -> addupdate subcategory");
  if (request.session.userInfo !== undefined) {
    if (Object.keys(request.body).length != 0 && typeof request.body === "object") {
      subCategoryService.addUpdateSubCategoryService(request, function (result) {
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

var deleteSubCategory = function (request, response) {
  debug("subcategory.controller -> delete subcategory");
  if (request.session.userInfo !== undefined && request.params !== undefined) {
    subCategoryService.deleteSubCategoryService(request, function (result) {
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
  getSubCategory: getSubCategory,
  addUpdateSubCategory: addUpdateSubCategory,
  deleteSubCategory: deleteSubCategory,
};
