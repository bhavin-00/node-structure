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
var tableActiveService = async function(request, response) {
    debug("other.service -> tableActiveService");

    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.tbl_code, request.body.is_active, request.body.id]);
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.otherMessage.ERR_INVALID_ACTIVE_BODY_REQUEST, false);

    var tableCode = request.body.tbl_code;
    var tableDetail = constant.tableCodeMapping.filter(function(d) {
        if (d.code == tableCode) {
            return d;
        }
    }).map(function(d) {
        return {
            tableName: d.tableName,
            pk_idField: d.pk_idField
        }
    })[0];

    var isActive = request.body.is_active;
    var tableName = tableDetail.tableName;
    var table_PK_IDField = tableDetail.pk_idField;
    var id = request.body.id;

    try {
        var result = await otherDAL.setTableActive(tableName, isActive, table_PK_IDField, id);
        return common.sendResponse(response, constant.otherMessage.ACTIVE_SUCCESS, true);
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};

/**
 * Created By: CBT
 * Updated By: CBT
 * getModuleService
 * @param  {Object}   request
 * @param  {Function} cb
 */
var getModuleService = async function(request, response) {
    debug("other.service -> getModuleService");

    try {
        let result = await otherDAL.getModule();
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
 * imageUploadMoving
 * @param  {Object}   fileObj
 * @param  {string}   imageFolder
 * @param  {Function} cb
 */
var imageUploadMoving = async function(fileObj, imageFolder) {
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
    return new Promise(function(resolve, reject) {


        async.series([
            function(cb) {
                // check active path folder is exist or not
                // if not create than create
                if (!fs.existsSync(activePath)) {
                    mkdirp(activePath, function(err) {
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
            function(cb) {
                if (!fs.existsSync(thumbpath)) {
                    mkdirp(thumbpath, function(err) {
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
            function(cb) {
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
        ], function(error, result) {
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
var uploadImageService = function(request, response) {
    debug("other.service -> uploadImageService");

    var isValidObject = common.validateObject([request.body]);
    var isValid = common.validateParams([request.body.file]);
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.otherMessage.ERR_INVALID_IMAGEUPLOAD_ADD_REQUEST, false);

    var userId = request.session.userInfo.userId;
    var filename = request.body.file.path.split('\\')[request.body.file.path.split('\\').length - 1];

    return {
        status: true,
        fileObj: request.body.file,
        url: common.getGetMediaURL(request) + "temp/large/" + filename
    };
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
var getMediaService = async function(request, response) {
    debug("other.service -> getMediaService");

    var isValidObject = common.validateObject([request.params]);
    var isValid = common.validateParams([request.params.type, request.params.imageType, request.params.fileName]);
    if (!isValidObject || !isValid)
        return common.sendResponse(response, constant.otherMessage.ERR_INVALID_GET_MEDIA_REQUEST, false);

    var type = request.params.type + "/";
    var imageType = request.params.imageType;
    var fileName = request.params.fileName;

    var dirname = constant.appConfig.MEDIA_ACTUAL_DIR;
    if (type.toLowerCase().trim() == "temp/") {
        var fullPath = constant.appConfig.UPLOAD_DIR + fileName;
    }
    else if (type.toLowerCase().trim() == constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY.toLowerCase().trim()) {
        var fullPath = dirname + constant.appConfig.MEDIA_UPLOAD_SUBFOLDERS_NAME.CATEGORY + fileName;
    }

    try {
        var result = await readFileInSync(fullPath);
        response.writeHead(200, {
            'Content-Type': result.data.type
        });
        response.end(result.data.fileObj, 'binary');
    }
    catch (ex) {
        debug(ex);
        return common.sendResponse(response, constant.userMessages.MSG_ERROR_IN_QUERY, false);
    }
};


function readFileInSync(fullPath) {
    var path = require('path');
    if (!fs.existsSync(fullPath)) {
        debug('file doesn\'t exist');
        fullPath = process.cwd() + constant.appConfig.MEDIA_DEFAULT_IMAGES_PATH + "noimage.jpg";
        debug(fullPath);
        type = 'image/jpg';
    }
    var fileReadingObj = fs.readFileSync(fullPath);
    return {
        status: true,
        data: {
            type: 'image/jpg',
            fileObj: fileReadingObj
        }
    };
}

module.exports = {
    tableActiveService: tableActiveService,
    getModuleService: getModuleService,
    imageUploadMoving: imageUploadMoving,
    uploadImageService: uploadImageService,
    getMediaService: getMediaService,
};
