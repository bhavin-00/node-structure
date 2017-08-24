var debug = require('debug')('server:api:v1:inventory:DAL');
var d3 = require("d3");
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./category.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;

/**
 * Created By: CBT
 * Updated By: CBT
 * [createCategory description]
 * @param  {[type]}   fieldValue [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var createCategory = function (fieldValue, cb) {
  debug("category.DAL -> createCategory");
  var createCategory = common.cloneObject(query.createCategory);
  createCategory.insert = fieldValue;
  common.executeQuery(createCategory, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [updateCategory description]
 * @param  {[type]}   fieldValue [description]
 * @param  {[type]}   categoryID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var updateCategory = function (fieldValue, categoryID, cb) {
  debug("category.DAL -> updateCategory");
  var updateCategory = common.cloneObject(query.updateCategory);
  updateCategory.update = fieldValue;
  updateCategory.filter.value = categoryID;
  common.executeQuery(updateCategory, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [getCategory description]
 * @param  {[type]}   dbServerDateTime [description]
 * @param  {[type]}   limit            [description]
 * @param  {Function} cb               [description]
 * @return {[type]}                    [description]
 */
var getCategory = function (categoryID, isActive, dbServerDateTime, limit, cb) {
  debug("category.DAL -> getCategory");
  var getCategoryQuery = common.cloneObject(query.getCategoryQuery);
  var categoryFilter = {
    and: []
  }
  if (categoryID > -1) {
    categoryFilter.and.push({
      field: 'pk_categoryID',
      operator: 'EQ',
      value: categoryID
    });
  }
  if (isActive > -1) {
    categoryFilter.and.push({
      field: 'isActive',
      operator: 'EQ',
      value: isActive
    });
  }
  if (categoryID < 0 && isActive < 0) {
    delete getCategoryQuery.filter;
  } else {
    getCategoryQuery.filter = categoryFilter;
  }

  // getCategoryQuery.limit = limit;
  common.executeQuery(getCategoryQuery, cb);
};




/**
 * Created By: CBT
 * Updated By: CBT
 * [checkCategoryIDValid description]
 * @param  {[type]}   categoryID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var checkCategoryIDValid = function (categoryID, cb) {
  debug("category.DAL -> checkDeleteCategoryIDValid");
  var checkCateGoryValid = common.cloneObject(query.checkCateGoryValidQuery);
  checkCateGoryValid.filter = {
    and: [{
      field: 'pk_categoryID',
      operator: 'EQ',
      value: categoryID
    }]
  }
  common.executeQuery(checkCateGoryValid, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeCategory description]
 * @param  {[type]}   categoryId [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var removeCategory = function (categoryId, cb) {
  debug("category.DAL -> removeCategory");
  var removeCategoryQuery = common.cloneObject(query.removeCategoryQuery);
  removeCategoryQuery.filter.value = categoryId;
  common.executeQuery(removeCategoryQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [checkCategoryIsExist description]
 * @param  {[type]}   categoryName [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var checkCategoryIsExist = function (category, cb) {
  debug("category.DAL -> checkDeleteCategoryIDValid");
  var checkCateGoryValid = common.cloneObject(query.checkCateGoryValidQuery);
  checkCateGoryValid.filter = {
    and: [{
      field: 'category',
      operator: 'EQ',
      value: category
    }]
  }
  common.executeQuery(checkCateGoryValid, cb);
};





module.exports = {
  createCategory: createCategory,
  updateCategory: updateCategory,
  getCategory: getCategory,
  checkCategoryIDValid: checkCategoryIDValid,
  removeCategory: removeCategory,
  checkCategoryIsExist: checkCategoryIsExist,
};
