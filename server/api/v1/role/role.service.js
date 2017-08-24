var debug = require('debug')('server:api:v1:role:service');
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var roleDAL = require('./role.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");


/**
 * Created By: CBT
 * Updated By: CBT
 * [addRoleService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var addRoleService = function (request, cb) {
  debug("role.service -> addRoleService");
  if (request.body.role_id == undefined || request.body.role_id === "" || request.body.userTypeId == undefined || request.body.userTypeId === "" || request.body.roleName == undefined || request.body.roleName === "" || request.body.moduleRights == undefined || request.body.moduleRights === "") {
    cb({
      status: false,
      error: constant.otherMessage.ERR_INVALID_ADD_ROLE_REQUEST
    });
    return;
  }

  var roleId = request.body.role_id;
  if (roleId == -1) {
    roleDAL.addRole(request.body.roleName, request.body.userTypeId, request.body.moduleRights, function (result) {
      if (result.status === false) {
        cb(result);
      } else {
        cb({
          status: true,
          data: constant.otherMessage.ROLE_CREATED_SUCCESSFUL
        });
      }
    });
  } else {
    roleDAL.updateRoleById(roleId, request.body.roleName, request.body.userTypeId, request.body.moduleRights, function (result) {
      if (result.status === false) {
        cb(result);
      } else {
        cb({
          status: true,
          data: constant.otherMessage.ROLE_UPDATED_SUCCESSFUL
        });
      }
    });
  }


};

/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleModuleMappingService description]
 * @param  {[Object]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var getRoleModuleMappingService = function (request, cb) {
  debug("role.service -> getRoleModuleMappingService");
  if (request.params.role_id === undefined || request.params.module_id === undefined || request.params.role_id === 0 || request.params.module_id === 0) {
    cb({
      status: false,
      error: constant.userMessages.ERR_INVALID_GET_ROLE_MODULE_MAPPING_REQUEST
    });
    return;
  } else {
    var roleID = request.params.role_id;
    var moduleID = request.params.module_id;
    roleDAL.getRoleModuleMapping(roleID, moduleID, function (result) {
      if (result.status === false) {
        cb(result);
        return
      }
      cb({
        status: true,
        data: result.content
      })
    });
  }
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [removeRoleService description]
 * @param  {Object}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var removeRoleService = function (request, cb) {
  debug("role.service -> removeRoleService");

  if (request.params.role_id === undefined) {
    cb({
      status: false,
      error: constant.userMessages.ERR_INVALID_ROLE_DELETE_REQUEST
    });
    return;
  } else {
    var roleId = request.params.role_id;
    roleDAL.checkUserExistanceWithRole(roleId, function (result) {
      if (result.status === false) {
        cb(result);
        return;
      } else if (result.content.length > 0) {
        cb({
          status: false,
          error: constant.userMessages.ERR_CANNOT_REMOVE_ROLE_NOW
        });
        return;
      } else {
        roleDAL.removeRole(roleId, function (result) {
          if (result.status === false) {
            cb(result);
            return
          }
          cb({
            status: true,
            data: constant.userMessages.MSG_ROLE_SUCESSFULLY_DELETED
          })
        });
      }
    });

  }
};


module.exports = {
  addRoleService: addRoleService,
  getRoleModuleMappingService: getRoleModuleMappingService,
  removeRoleService: removeRoleService,
};
