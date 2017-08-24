var debug = require('debug')('server:api:v1:role:DAL');
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./role.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");

/**
 * Created By: CBT
 * Updated By: CBT
 * [addRole description]
 * @param {[string]}   tableName   [description]
 * @param {[int]}   pk_idField  [description]
 * @param {int}  pk_idValue  [description]
 * @param {Function} cb          [description]
 */
var addRole = function (roleName, userTypeId, moduleRights, cb) {
  debug("role.DAL -> addRole");
  var addRoleQuery = common.cloneObject(query.addRoleQuery);
  addRoleQuery.insert = [];
  addRoleQuery.insert = [{
    field: "role",
    fValue: roleName
  }, {
    field: "fk_userTypeID",
    fValue: userTypeId
  }];
  common.executeQuery(addRoleQuery, function (result) {
    if (result.status == false) {
      cb(result);
    } else {
      createRoleModuleMapping(moduleRights, result.content.insertId, cb);
    }
  });
};
/**
 * Created By: CBT
 * Updated By: CBT
 * [createRoleModuleMapping description]
 * @param {[array Object]}   moduleRights   [description]
 * @param {int}   roleId  [description]
 * @param {Function} cb          [description]
 */
function createRoleModuleMapping(moduleRights, roleId, cb) {
  var mappingQueries = [];
  createdModuleMappingQueries(0);
  function createdModuleMappingQueries(index) {
    if (index >= moduleRights.length) {
      common.executeQueryWithTransactions(mappingQueries, cb);
    } else {
      var moduleMappingQuery = common.cloneObject(query.moduleMappingQuery);
      var moduleInfo = moduleRights[index];
      moduleMappingQuery.insert = [];
      moduleMappingQuery.insert.push({
        field: "fk_moduleID",
        fValue: moduleInfo.moduleId
      }, {
          field: "fk_roleID",
          fValue: roleId
        }, {
          field: "canView",
          fValue: moduleInfo.canView
        }, {
          field: "canAddEdit",
          fValue: moduleInfo.canAddEdit
        }, {
          field: "canDelete",
          fValue: moduleInfo.canDelete
        });
      mappingQueries.push(moduleMappingQuery);
      createdModuleMappingQueries(index + 1);
    }
  }
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleModuleMapping description]
 * @param  {int}   userID [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var getRoleModuleMapping = function (roleId, moduleId, cb) {
  debug("role.DAL -> getRoleModuleMapping");
  var getRoleModuleMappingQuery = common.cloneObject(query.getRoleModuleMappingQuery);
  var roleFilter = { and: [] }
  if (roleId > 0) {
    roleFilter.and.push({
      field: 'fk_roleID',
      operator: 'EQ',
      value: roleId
    });
  }
  if (moduleId > 0) {
    roleFilter.and.push({
      field: 'fk_moduleID',
      operator: 'EQ',
      value: moduleId
    });
  }
  if (roleId < 0 && moduleId < 0) {
    delete getRoleModuleMappingQuery.filter
  } else {
    getRoleModuleMappingQuery.filter = roleFilter;
  }
  common.executeQuery(getRoleModuleMappingQuery, cb);
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [updateRoleById description]
 * @param  {int}   roleId [description]
 * @param  {string}   roleName [description]
 * @param  {int}   userTypeId [description]
 * @param  {Array of  Object}   moduleRights [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var updateRoleById = function (roleId, roleName, userTypeId, moduleRights, cb) {
  debug("role.DAL -> updateRoleById");
  var updateRoleQueries = [];
  var updateRoleQuery = common.cloneObject(query.updateRoleQuery);
  updateRoleQuery.update = [];
  updateRoleQuery.update.push({
    field: "role",
    fValue: roleName
  }, {
      field: "fk_userTypeID",
      fValue: userTypeId
    });
  updateRoleQuery.filter = {
    field: 'pk_RoleID',
    operator: 'EQ',
    value: roleId
  };
  updateRoleQueries.push(updateRoleQuery);

  createdModuleMappingQueries(0);
  function createdModuleMappingQueries(index) {
    if (index >= moduleRights.length) {
      common.executeQueryWithTransactions(updateRoleQueries, cb);
    } else {
      var updateRoleModuleMappingQuery = common.cloneObject(query.updateRoleModuleMappingQuery);
      var moduleInfo = moduleRights[index];
      updateRoleModuleMappingQuery.update = [];
      updateRoleModuleMappingQuery.update.push({
        field: "fk_moduleID",
        fValue: moduleInfo.moduleId
      }, {
          field: "fk_roleID",
          fValue: roleId
        }, {
          field: "canView",
          fValue: moduleInfo.canView
        }, {
          field: "canAddEdit",
          fValue: moduleInfo.canAddEdit
        }, {
          field: "canDelete",
          fValue: moduleInfo.canDelete
        });
      updateRoleModuleMappingQuery.filter = {
        and: [{
          field: 'fk_moduleID',
          operator: 'EQ',
          value: moduleInfo.moduleId
        }, {
          field: 'fk_roleID',
          operator: 'EQ',
          value: roleId
        }]
      }

      updateRoleQueries.push(updateRoleModuleMappingQuery);
      createdModuleMappingQueries(index + 1);
    }
  }

}


/**
 * Created By: CBT
 * Updated By: CBT
 * [checkUserExistanceWithRole description]
 * @param  {int}   roleId [description]
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
var checkUserExistanceWithRole = function (roleId, cb) {
  debug("role.DAL -> checkUserExistanceWithRole");
  var checkUserIsExistQuery = common.cloneObject(query.checkUserIsExistQuery);
  checkUserIsExistQuery.filter.value = roleId;
  common.executeQuery(checkUserIsExistQuery, cb);
};

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeRole description]
 * @param  {int}   roleId [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var removeRole = function (roleId, cb) {
  debug("role.DAL -> removeRole");
  //CBT:remove role from role module mapping table
  var removeRoleMappingQuery = common.cloneObject(query.removeRoleMappingQuery);
  removeRoleMappingQuery.filter.value = roleId;
  common.executeQuery(removeRoleMappingQuery, function (result) {
    if (result.status == false) {
      cb(result);
    } else {
      //CBT:remove role
      var removeRoleQuery = common.cloneObject(query.removeRoleQuery);
      removeRoleQuery.filter.value = roleId;
      common.executeQuery(removeRoleQuery, cb);
    }
  });


}

module.exports = {
  addRole: addRole,
  getRoleModuleMapping: getRoleModuleMapping,
  updateRoleById: updateRoleById,
  checkUserExistanceWithRole: checkUserExistanceWithRole,
  removeRole: removeRole,
};
