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
var addRoleService = async function (request, response) {
  debug("role.service -> addRoleService");

  var isValidObject = common.validateObject([request.body]);
  var isValid = common.validateParams([request.body.role_id, request.body.userTypeId, request.body.roleName, request.body.moduleRights]);
  if (!isValidObject || !isValid)
    return common.sendResponse(response, constant.otherMessage.ERR_INVALID_ADD_ROLE_REQUEST, false);

  var roleId = request.body.role_id;
  try {
    if (roleId == -1) {
      let result = await roleDAL.addRole(request.body.roleName, request.body.userTypeId, request.body.moduleRights);
      return common.sendResponse(response, constant.otherMessage.ROLE_CREATED_SUCCESSFUL, true);

    } else {
      var let = await roleDAL.updateRoleById(roleId, request.body.roleName, request.body.userTypeId, request.body.moduleRights);
      return common.sendResponse(response, constant.otherMessage.ROLE_UPDATED_SUCCESSFUL, true);
    }

  }
  catch (ex) {
    debug(ex);
    return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
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
var getRoleModuleMappingService = async function (request, response) {
  debug("role.service -> getRoleModuleMappingService");
  var isValidObject = common.validateObject([request.params]);
  var isValid = common.validateParams([request.params.role_id, request.params.module_id]);
  if (!isValidObject || !isValid)
    return common.sendResponse(response, constant.otherMessage.ERR_INVALID_GET_ROLE_MODULE_MAPPING_REQUEST, false);

  var roleID = request.params.role_id;
  var moduleID = request.params.module_id;

  try {
    let result = await roleDAL.getRoleModuleMapping(roleID, moduleID);
    return common.sendResponse(response, result.content, true);
  }
  catch (ex) {
    debug(ex);
    return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
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
var removeRoleService = async function (request, response) {
  debug("role.service -> removeRoleService");
  var isValidObject = common.validateObject([request.params]);
  var isValid = common.validateParams([request.params.role_id]);
  if (!isValidObject || !isValid)
    return common.sendResponse(response, constant.userMessages.ERR_INVALID_ROLE_DELETE_REQUEST, false);

  var roleId = request.params.role_id;

  try {
    let result = await roleDAL.checkUserExistanceWithRole(roleId);
    if (result.content.length > 0)
      return common.sendResponse(response, constant.userMessages.ERR_CANNOT_REMOVE_ROLE_NOW, false);

    let resultRemoveRole = await roleDAL.removeRole(roleId);
    return common.sendResponse(response, constant.userMessages.MSG_ROLE_SUCESSFULLY_DELETED, true);
  }
  catch (ex) {
    debug(ex);
    return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
  }
};


module.exports = {
  addRoleService: addRoleService,
  getRoleModuleMappingService: getRoleModuleMappingService,
  removeRoleService: removeRoleService,
};
