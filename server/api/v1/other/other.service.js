var debug = require('debug')('server:api:v1:Other:service');
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var otherDAL = require('./other.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;
var d3 = require("d3");
var async = require("async");
var fileExtension = require('file-extension');
var randomstring = require("randomstring");
var sizeOf = require('image-size');
var fs = require('fs');
var mkdirp = require('mkdirp');

/**
 * Created By: CBT
 * Updated By: CBT
 * [tableActiveService description]
 * @param  {[Object]}   request [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var tableActiveService = function (request, cb) {
  debug("other.service -> tableActiveService");
  if (request.body.tbl_code == undefined || request.body.tbl_code === "" || request.body.is_active == undefined || request.body.is_active === "" || request.body.id == undefined || request.body.id === "") {
    cb({
      status: false,
      error: constant.otherMessage.ERR_INVALID_TABLE_ACTIVE_REQUEST
    });
    return;
  }

  var tableCode = request.body.tbl_code;
  var tableDetail = constant.tableCodeMapping.filter(function (d) {
    if (d.code == tableCode) {
      return d;
    }
  }).map(function (d) {
    return {
      tableName: d.tableName,
      pk_idField: d.pk_idField
    }
  })[0];

  var isActive = request.body.is_active;
  var tableName = tableDetail.tableName;
  var table_PK_IDField = tableDetail.pk_idField;
  var id = request.body.id;
  otherDAL.setTableActive(tableName, isActive, table_PK_IDField, id, function (result) {
    if (result.status === false) {
      cb(result);
    } else {
      cb({
        status: true,
        data: constant.otherMessage.ACTIVE_SUCCESS
      });
    }
  });
};

/**
 * Created By: CBT
 * Updated By: CBT
 * getModuleService
 * @param  {Object}   request
 * @param  {Function} cb
 */
var getModuleService = function (request, cb) {
  debug("other.service -> getModuleService");
  otherDAL.getModule(function (result) {
    if (result.status == false) {
      cb({
        status: false,
        error: result.error
      });
      return;
    }
    cb({
      status: true,
      data: result.content
    });
  })
}

/**
 * Created By: CBT
 * Updated By: CBT
 * imageUploadMoving
 * @param  {Object}   fileObj
 * @param  {string}   imageFolder
 * @param  {Function} cb
 */
var imageUploadMoving = async function (fileObj, imageFolder) {
  debug("other.service -> imageUploadMoving");
  var activePath = '';
  var subFolder = '';

  activePath = constant.appConfig.MEDIA_ACTUAL_DIR;
  if (imageFolder == constant.appConfig.MEDIA_MOVING_PATH.CATEGORY) {
    subFolder = constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY;
    activePath += subFolder;
    var thumbpath = activePath + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Thumb;
    return await imageUploadMovingParticularFolder(fileObj, activePath, thumbpath);    
  }
}


function imageUploadMovingParticularFolder(fileObj, activePath, thumbpath, cb) {
  debug("other.service -> imageUploadMovingParticularFolder");
  return new Promise(function(resolve,reject){


  async.series([
    function (cb) {
      // check active path folder is exist or not
      // if not create than create
      if (!fs.existsSync(activePath)) {
        mkdirp(activePath, function (err) {
          if (err) {
            debug("folder error: ", err);
            debug("folder path: ", activePath);
            cb({
              status: false,
              error: constant.otherMessage.ERR_CREATE_AVTIVE_PATH_FOLDER
            }, null);
          } else {
            debug('folder is created!');
            cb();
          }
        });
      } else {
        cb();
      }
    },
    function (cb) {
      if (!fs.existsSync(thumbpath)) {
        mkdirp(thumbpath, function (err) {
          if (err) {
            debug("folder error: ", err);
            debug("folder path: ", activePath);
            cb({
              status: false,
              error: constant.otherMessage.ERR_CREATE_THUMB_PATH_FOLDER
            }, null);
          } else {
            debug('folder is created!');
            cb();
          }
        });
      } else {
        cb();
      }
    },
    function (cb) {
      // transferring file tmp folder to particular folder
      try {
        var file = fs.readFileSync(fileObj.path);
        // find image orientation
        var dimensions = sizeOf(file);
        var width = dimensions.width;
        var height = dimensions.height;
        var orientation = width > height ? 'landscape' : 'portrait';
        debug("file orientation: ", orientation);
        var type = fileObj.type;
        var fileExt = fileExtension(fileObj.name);
        debug("file type: ", fileExt);
        var newFileName = (new Date().getTime()) + "_" + randomstring.generate(constant.appConfig.MEDIA_UPLOAD_FILE_NAME_SETTINGS) + '_' + fileObj.name;
        var newFilePathwithName = activePath + newFileName;
        fs.writeFileSync(newFilePathwithName, file);
        fs.unlinkSync(fileObj.path);
        cb({
          status: true,
          data: {
            file: newFileName,
            type: type,
            orientation: orientation
          }
        });
      } catch (error) {
        debug("media upload error: ", error);
        cb({
          status: false,
          error: constant.otherMessage.ERR_IMAGE_NOT_UPLOADED
        }, null)
      }
    }
  ], function (error, result) {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  }); // async series end
});
}


/**
 * Created By: CBT
 * Updated By: CBT
 * uploadImageService
 * @param  {Object}   fileObj
 * @param  {string}   imageFolder
 * @param  {Function} cb
 */
var uploadImageService = function (request, cb) {
  debug("other.service -> uploadImageService");
  // var fileObj = request.body.filename;
  var userId = request.session.userInfo.userId;
  if (request.body.file === undefined) {
    cb({
      status: false,
      error: constant.otherMessage.ERR_INVALID_MEDIA_UPLOAD_REQUEST
    });
    return;
  }
  var filename = request.body.file.path.split('\\')[request.body.file.path.split('\\').length - 1];

  cb({
    status: true,
    fileObj: request.body.file,
    url: common.getGetMediaURL(request) + "temp/large/" + filename
  });
  return;
};



/**
 * Created By: CBT
 * Updated By: CBT
 * getMediaService
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var getMediaService = function (request, cb) {
  debug("other.service -> getMediaService");
  if (request.params.type === undefined || request.params.imageType === undefined || request.params.fileName === undefined) {
    cb({
      status: false,
      error: constant.otherMessage.ERR_INVALID_GET_MEDIA_REQUEST
    });
    return;
  }
  var type = request.params.type + "/";
  var imageType = request.params.imageType;
  var fileName = request.params.fileName;

  var dirname = constant.appConfig.MEDIA_ACTUAL_DIR;
  if (type.toLowerCase().trim() == "temp/") {
    var fullPath = constant.appConfig.UPLOAD_DIR + fileName;
    readFileInSync(fullPath, cb);
    return;
  }

  // else if (type.toLowerCase().trim() == constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Product.toLowerCase().trim()) {
  //   if (imageType.toLowerCase().trim() == "thumb") {
  //     var fullPath = dirname + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Product + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Thumb + fileName;
  //     readFileInSync(fullPath, cb);
  //     return;
  //   } else {
  //     var fullPath = dirname + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Product + fileName;
  //     readFileInSync(fullPath, cb);
  //     return;
  //   }
  // }
  // else if (type.toLowerCase().trim() == constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Banner.toLowerCase().trim()) {
  //   var fullPath = dirname + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.Banner + fileName;
  //   readFileInSync(fullPath, cb);
  //   return;
  // }
  else if (type.toLowerCase().trim() == constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY.toLowerCase().trim()) {
    var fullPath = dirname + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY + fileName;
    readFileInSync(fullPath, cb);
    return;
  }
};


function readFileInSync(fullPath, cb) {
  var path = require('path');
  if (!fs.existsSync(fullPath)) {
    debug('file doesn\'t exist');
    fullPath = process.cwd() + constant.appConfig.MEDIA_DEFAULT_IMAGES_PATH + "noimage.jpg";
    debug(fullPath);
    type = 'image/jpg';
  }
  var fileReadingObj = fs.readFileSync(fullPath);
  cb({
    status: true,
    data: {
      type: 'image/jpg',
      fileObj: fileReadingObj
    }
  });
}
module.exports = {
  tableActiveService: tableActiveService,
  getModuleService: getModuleService,
  imageUploadMoving: imageUploadMoving,
  uploadImageService: uploadImageService,
  getMediaService: getMediaService,
};
