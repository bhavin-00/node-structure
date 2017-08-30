var debug = require('debug')('server:api:v1:Other:DAL');
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./other.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");

/**
 * Created By: CBT
 * Updated By: CBT
 * [setTableActive description]
 * @param {[string]}   tableName   [description]
 * @param {[int]}   pk_idField  [description]
 * @param {int}  pk_idValue  [description]
 * @param {Function} cb          [description]
 */
var setTableActive = async function (tableName, isActive, table_PK_IDField, pk_idValue) {
  debug("other.DAL -> setTableActivee");
  var updateTableQuery = common.cloneObject(query.updateTableQuery);
  updateTableQuery.table = tableName;
  updateTableQuery.update = [];
  updateTableQuery.update.push({
    field: "isActive",
    fValue: isActive
  });
  updateTableQuery.filter.field = table_PK_IDField;
  updateTableQuery.filter.value = pk_idValue;
  return await common.executeQuery(updateTableQuery);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [getModule description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var getModule = async function () {
  debug("other.DAL -> getModule");
  var getModuleQuery = common.cloneObject(query.getModuleQuery);
  return await common.executeQuery(getModuleQuery);
}

module.exports = {
  setTableActive: setTableActive,
  getModule: getModule,
};
