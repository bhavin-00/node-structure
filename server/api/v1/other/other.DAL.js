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
var setTableActive = function (tableName, isActive, table_PK_IDField, pk_idValue, cb) {
  debug("other.DAL -> setTableActivee");
  var updateTableQuery = common.cloneObject(query.updateTableQuery);
  updateTableQuery.table = tableName;
  updateTableQuery.update = [];
  updateTableQuery.update.push({
    field: "isActive",
    fValue: isActive
  }, {
      field: "modifiedDate",
      fValue: d3.timeFormat(dbDateFormat)(new Date())
    });
  updateTableQuery.filter.field = table_PK_IDField;
  updateTableQuery.filter.value = pk_idValue;
  common.executeQuery(updateTableQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [getModule description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var getModule = function (cb) {
  debug("other.DAL -> getModule");
  var getModuleQuery = common.cloneObject(query.getModuleQuery);
  common.executeQuery(getModuleQuery, cb);
}

module.exports = {
  setTableActive: setTableActive,
  getModule: getModule,
};
