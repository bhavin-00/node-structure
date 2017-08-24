var debug = require('debug')('server:api:v1:subcategory:DAL');
var d3 = require("d3");
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./subcategory.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;


/**
 * Created By: CBT
 * Updated By: CBT
 * [createSubCategory description]
 * @param  {[type]}   fieldValue [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */

var createSubCategory = function (fieldValue, cb) {
  debug("subcategory.DAL -> createSubCategory");
  var createSubCategory = common.cloneObject(query.createSubCategory);
  createSubCategory.insert = fieldValue;
  common.executeQuery(createSubCategory, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [updateSubCategory description]
 * @param  {[type]}   fieldValue [description]
 * @param  {[type]}   categoryID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */

var updateSubCategory = function (fieldValue, categoryID, cb) {
  debug("category.DAL -> updateSubCategory");
  var updateSubCategory = common.cloneObject(query.updateSubCategory);
  updateSubCategory.update = fieldValue;
  updateSubCategory.filter.value = categoryID;
  common.executeQuery(updateSubCategory, cb);
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
var getSubCategory = function (subCategoryID, isActive, dbServerDateTime, limit, cb) {
  debug("subcategory.DAL -> getSubCategory");
  var getSubCategoryQuery = common.cloneObject(query.getSubCategoryQuery);
  var subCategoryFilter = {
    and: []
  }
  if (subCategoryID > -1) {
    subCategoryFilter.and.push({
      table: 'B',
      field: 'pk_subCategoryID',
      operator: 'EQ',
      value: subCategoryID
    });
  }
  if (isActive > -1) {
    subCategoryFilter.and.push({
      table: 'B',
      field: 'isActive',
      operator: 'EQ',
      value: isActive
    });
  }
  if (subCategoryID < 0 && isActive < 0) {
    delete getSubCategoryQuery.filter;
  } else {
    getSubCategoryQuery.filter = subCategoryFilter;
  }

  // getSubCategoryQuery.limit = limit;
  common.executeQuery(getSubCategoryQuery, cb);
};




/**
 * Created By: CBT
 * Updated By: CBT
 * [checkCategoryIDValid description]
 * @param  {[type]}   categoryID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */

var checkSubCategoryIDValid = function (subCategoryID, cb) {
  debug("subcategory.DAL -> checkDeleteSubategoryIDValid");
  var checkSubCategoryValidQuery = common.cloneObject(query.checkSubCategoryValidQuery);
  checkSubCategoryValidQuery.filter = {
    and: [{
      field: 'pk_subCategoryID',
      operator: 'EQ',
      value: subCategoryID
    }]
  }
  common.executeQuery(checkSubCategoryValidQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeCategory description]
 * @param  {[type]}   categoryId [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */


// /**
//  * Created By: CBT
//  * Updated By: CBT
//  * [checkCategoryIsExist description]
//  * @param  {[type]}   categoryName [description]
//  * @param  {Function} cb         [description]
//  * @return {[type]}              [description]
//  */
var checkSubCategoryIsExist = function (subcategory, cb) {
  debug("subcategory.DAL -> checkDeleteSubCategoryIDValid");
  var checkSubCategoryValid = common.cloneObject(query.checkSubCategoryValidQuery);
  checkSubCategoryValid.filter = {
    and: [{
      field: 'subCategory',
      operator: 'EQ',
      value: subcategory
    }]
  }
  common.executeQuery(checkSubCategoryValid, cb);
};


var removeSubCategory = function (subCategoryId, cb) {
  debug("subcategory.DAL -> removeSubCategory");
  var removeSubCategoryQuery = common.cloneObject(query.removeSubCategoryQuery);
  removeSubCategoryQuery.filter.value = subCategoryId;
  common.executeQuery(removeSubCategoryQuery, cb);
};


module.exports = {
  createSubCategory: createSubCategory,
  updateSubCategory: updateSubCategory,
  getSubCategory: getSubCategory,
  checkSubCategoryIDValid: checkSubCategoryIDValid,
  removeSubCategory: removeSubCategory,
  checkSubCategoryIsExist: checkSubCategoryIsExist,
};
