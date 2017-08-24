var debug = require('debug')('server:api:v1:role:controller');
var roleService = require('./role.service');
var constant = require('../constant');

/**
 * Created By: CBT
 * Updated By: CBT
 * [addRole description]
 * @param  {[Object]} request  [description]
 * @param  {[Object]} response [description]
 * @return {[Object]}          [description]
 */
var addRole = function(request, response) {
  debug("role.controller -> addRole");
    if (request.body != undefined && typeof request.body === "object") {
      roleService.addRoleService(request, function(result) {
        return response.send(result);
      })
    } else {
      return response.send({
        status: false,
        error: constant.otherMessage.ERR_INVALID_ADD_ROLE_REQUEST
      });
    }

};


/**
 * Created By: CBT
 * Updated By: CBT
 * [getRoleModuleMapping description]
 * @param  {[Object]} request  [description]
 * @param  {[Object]} response [description]
 * @return {[Object]}          [description]
 */
var getRoleModuleMapping = function(request, response) {
  debug("role.controller -> getRoleModuleMapping");
  if (request.session.userInfo !== undefined) {
    roleService.getRoleModuleMappingService(request, function(result) {
      return response.send(result);
    });
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_GET_ROLE_MODULE_MAPPING_REQUEST
    });
  }
};

/**
* Created By: CBT
* Updated By: CBT
* @param  {object} request
* @param  {object} response
* @return {object}
*/
var removeRole = function(request, response){
  debug("role.controller -> removeRole");
  if (request.session.userInfo !== undefined) {
    roleService.removeRoleService(request, function(result) {
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.userMessages.ERR_INVALID_ROLE_DELETE_REQUEST
    });
  }
}

module.exports = {
  addRole:addRole,
  getRoleModuleMapping:getRoleModuleMapping,
  removeRole:removeRole,
};
