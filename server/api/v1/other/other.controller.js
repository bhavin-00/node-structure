var debug = require('debug')('server:api:v1:Other:controller');
var otherService = require('./other.service');
var constant = require('../constant');

/**
 * Created By: CBT
 * Updated By: CBT
 * [CBT:make table active/deactive description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var tableActive = function (request, response) {
  debug("other.controller -> tableActive");
  if (request.session.userInfo !== undefined) {
    if (Object.keys(request.body).length != 0 && typeof request.body === "object") {
      otherService.tableActiveService(request, function (result) {
        return response.send(result);
      })
    } else {
      return response.send({
        status: false,
        error: constant.otherMessage.ERR_INVALID_ACTIVE_BODY_REQUEST
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
* Created By: CBT
* Updated By: CBT
* CBT:get module based on request parameter
*  @param  {object} request
* @param  {object} response
* @return {object}
*/
var getModule = function (request, response) {
  debug("other.controller -> getModule");
  if (request.session.userInfo !== undefined) {
    otherService.getModuleService(request, function (result) {
      return response.send(result);
    })
  } else {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_INVALID_REQUEST_GET_MODULE_LIST
    });
  }
}

/**
 * Created By: CBT
 * Updated By: CBT
 * [uploadImage description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var uploadImage = function (request, response) {
  debug("other.controller -> uploadImage");
  if (request.session.userInfo !== undefined) {
    if (request.body !== undefined && typeof request.body === "object") {
      otherService.uploadImageService(request, function (result) {
        return response.send(result);
      });
    } else {
      return response.send({
        status: false,
        error: constant.otherMessage.ERR_INVALID_IMAGEUPLOAD_ADD_REQUEST
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
 * Created By: CBT
 * Updated By: CBT
 * [getMedia description]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
var getMedia = function (request, response) {
  debug("other.controller -> getMedia");
  if (request.params !== undefined) {
    otherService.getMediaService(request, function (result) {
      if (result.status === false) {
        return response.send(result);
      } else {
        response.writeHead(200, {
          'Content-Type': result.data.type
        });
        response.end(result.data.fileObj, 'binary');
      }
    });
  } else {
    return response.send({
      status: false,
      error: constant.otherMessage.ERR_INVALID_GET_MEDIA_REQUEST
    });
  }
};
module.exports = {
  tableActive: tableActive,
  getModule: getModule,
  uploadImage: uploadImage,
  getMedia: getMedia,
};
