var applicationConfiguration = {
  "MAX_OTP_SEND_LIMIT": 3,
  "MAX_OTP_EXPIRY_SECONDS": 300, // 5 minute
  "OTP_SETTINGS": {
    "length": 5, // max length 10
    "charset": 'numeric'
  },
  "APPLICATION_API_KEY": "1", // 2.16 server
  "MAX_ACCESS_TOKEN_EXPIRY_HOURS": 720, // 30 days
  "PAGE_SIZE": 10, //
  "API_START_PATH": '/api/',
  "API_VERSION": 'v1',
  "DB_DATE_FORMAT": '%Y-%m-%d %H:%M:%S',
  "MEDIA_GET_STATIC_URL": '/api/v1/other/get-media/',
  "UPLOAD_DIR": 'D:/gitlab/tmp_Images/',//'E:/easypay/javascript/public/uploads/',
  "MEDIA_ACTUAL_DIR": 'D:/gitlab/server/images/Upload_Images/',//'/root/easypay/public/images/Upload_Images/',
  "MEDIA_UPLOAD_DIR": 'D:/gitlab/tmp_Images/',//'/root/public/images/tmp_Images/',
  "MEDIA_UPLOAD_FILE_NAME_SETTINGS": {
    "length": 12,
  },
  "MEDIA_UPLOAD_SUBFOLDERS_NAME": {
    "CATEGORY": "categoryAndSubCategory/",
    "Thumb": "Thumb/"
  },
  "IMAGE_GET_STATIC_URL": '/images/Upload_Images/',
  "MEDIA_DEFAULT_IMAGES_PATH": 'D:/gitlab/public/images/',//'/server/images/', // path must be same level of app.js
  "MEDIA_DEFAULT_IMAGES_NAME": {
    "USER_PROFILE": 'user_profile.png',
    "TEAM_LOGO": 'teamlogo.png',
    "MATCH_MEDIA": 'images.png',
  },
  "MEDIA_MOVING_PATH":{
    "CATEGORY":"category"
  },
  "VALID_ACTIVE_STATUS_PARAM": ["0", "1", "-1"]
};


var requestMessages = {
  'ERR_API_KEY_NOT_FOUND': {
    code: 2001,
    message: 'api-key not found'
  },
  'ERR_INVALID_API_KEY': {
    code: 2002,
    message: 'Invalid api-key'
  },
  'ERR_UDID_NOT_FOUND': {
    code: 2003,
    message: 'UDID not found'
  },
  'ERR_DEVICE_TYPE_NOT_FOUND': {
    code: 2004,
    message: 'device-type not found'
  },
  'ERR_INVALID_SIGNUP_REQUEST': {
    code: 2005,
    message: 'Invalid SignUp Request.'
  },
  'ERR_INVALID_SEND_OTP_REQUEST': {
    code: 2006,
    message: 'Invalid send otp request'
  },
  'ERR_INVALID_VERIFY_OTP_REQUEST': {
    code: 2007,
    message: 'Invalid verify otp request'
  },
  'ERR_INVALID_USER_PROFILE_UPDATE_REQUEST': {
    code: 2008,
    message: 'Invalid user profile update request'
  },
  'ERR_INVALID_SIGNIN_REQUEST': {
    code: 2009,
    message: 'Invalid SignIn request'
  },
  'ERR_INVALID_FORGOT_PASSWORD_REQUEST': {
    code: 2010,
    message: 'Invalid forgot password request'
  },
  'ERR_INVALID_RESET_PASSWORD_REQUEST': {
    code: 2011,
    message: 'Invalid reset password request'
  },
  'ERR_INVALID_CHANGE_PASSWORD_REQUEST': {
    code: 2012,
    message: 'Invalid change password request'
  },
  'ERR_INVALID_GET_MY_PROFILE_REQUEST': {
    code: 2013,
    message: 'Invalid get my profile request'
  },
  'ERR_INVALID_CATEGORY_ADD_REQUEST': {
    code: 2014,
    message: 'Invalid category add/update request'
  },
  'ERR_INVALID_CATEGORY_GET_REQUEST': {
    code: 2015,
    message: 'Invalid category get request'
  },
  'ERR_INVALID_CATEGORY_UPDATE_REQUEST': {
    code: 2016,
    message: 'Invalid category update request'
  },
  'ERR_INVALID_CATEGORY_GET_REQUEST': {
    code: 2017,
    message: 'Invalid category GET request'
  },
  'ERR_INVALID_CATEGORY_DELETE_REQUEST': {
    code: 2018,
    message: 'Invalid category DELETE request'
  },
  'ERR_INVALID_GET_ADMIN_USER_REQUEST':{
    code: 2030,
    message: 'Unable to get admin user'
  },
  'ERR_INVALID_ADD_UPDATE_REQUEST_OF_ADMIN_USER':{
    code: 2031,
    message: 'Invalid request to add update admin user'
  },
  'ERR_INVALID_REQUEST_GET_USER_LIST':{
    code: 2044,
    message: 'Invalid request to get users'
  },
  'ERR_UNABLE_TO_GET_USER_LIST':{
    code: 2045,
    message: "unable to get users"
  },
  'ERR_INVALID_REQUEST_GET_MODULE_LIST':{
    code: 2046,
    message: 'Invalid request to get module'
  },
  'ERR_INVALID_GET_USERLIST_REQUEST': {
    code: 2047,
    message: 'Invalid get user list Request.'
  }
};


var userRole = {
  'admin': 1,
};

var userType = {
  'admin': 1,
};

var userMessages = {
  'ERR_USER_IS_ALREADY_EXIST': {
    code: 17001,
    message: 'User is Already Exist.'
  },
  'ERR_USER_IS_NOT_ACTIVE': {
    code: 17002,
    message: 'User isn\'t active.'
  },
  'MSG_OTP_SENT_SUCCEFULLY': {
    code: 17003,
    message: 'One Time Password (OTP) has been sent to your mobile {{mobile}}, please enter the same here to verify.'
  },
  'ERR_OTP_LIMIT_EXCEEDED': {
    code: 17004,
    message: 'You have exceeded the maximum number of attempts at this time. Please wait 24 hours and try again later.'
  },
  'ERR_OTP_INVALID': {
    code: 17005,
    message: 'Invalid one time password (OTP) entered.'
  },
  'ERR_USER_NOT_EXIST': {
    code: 17006,
    message: 'User is not exist.'
  },
  'ERR_OTP_IS_EXPIRED': {
    code: 17007,
    message: 'One Time Password (OTP) was expired.'
  },
  'ERR_INVALID_MOBILE_AND_PASSWORD': {
    code: 17008,
    message: 'Please enter valid mobile/email and password.'
  },
  'MSG_PASSWORD_CHANGE_SUCCESSFULLY': {
    code: 17009,
    message: 'Password change successfully'
  },
  'ERR_OLD_PASSWORD_NOT_MATCH': {
    code: 17010,
    message: 'Old password is not match.'
  },
  'MSG_PASSWORD_RESET_SUCCESSFULLY': {
    code: 17011,
    message: 'Password reset successfully'
  },
  'MSG_SIGNOUT_SUCCESSFULLY': {
    code: 17012,
    message: 'Signout successfully.'
  },
  'ERR_SIGNOUT_IS_NOT_PROPER': {
    code: 17013,
    message: 'Signout is not proper.'
  },
  'MSG_SIGNUP_SUCCESSFULLY': {
    code: 17014,
    message: 'Registration Successfully'
  },
  'ERR_INVALID_EMAIL_AND_PASSWORD': {
    code: 17015,
    message: 'Please enter valid email and password.'
  },
  'ERR_INVALID_USERINFO': {
    code: 17016,
    message: 'User Info is undefined.'
  },
  'MSG_ADMIN_SUCESSFULLY_CREATED':{
    code: 17017,
    message: 'Admin user sucessfully created.'
  },
  'ERR_INVALID_USER_DELETE_REQUEST':{
    code: 17018,
    message: 'Invalid request to delete user.'
  },
  'MSG_USER_SUCESSFULLY_DELETED':{
    code: 17019,
    message: 'User sucessfully deleted.'
  },
  'ERR_INVALID_GET_ROLE_REQUEST':{
    code: 17020,
    message: 'Invalid request to get role'
  },
  'MSG_ADMIN_SUCESSFULLY_UPDATED':{
    code: 17021,
    message: 'Admin User sucessfully updated'
  },
  'ERR_PASSWORD_NOT_MATCH':{
    code: 17022,
    message: 'Password Not Match'
  },
  'ERR_INVALID_GET_USER_TYPE_REQUEST':{
    code: 17023,
    message: 'Invalid request to get user type'
  },
  'ERR_INVALID_GET_ROLE_MODULE_MAPPING_REQUEST':{
    code: 17024,
    message: 'Invalid request to get role module mapping'
  },
  'ERR_INVALID_ROLE_DELETE_REQUEST':{
    code: 17025,
    message: 'Invalid request to remove role.'
  },
  'ERR_CANNOT_REMOVE_ROLE_NOW':{
    code: 17026,
    message: 'You cannot remove role now.'
  },
  'MSG_ROLE_SUCESSFULLY_DELETED':{
    code: 17027,
    message: 'Role sucessfully deleted.'
  },
  'MSG_ERROR_IN_QUERY':{
    code: 17028,
    message: 'Error in execute query.'
  }
};

var userRightsByApiMessage = {
  'API_URL_NOT_IN_USER_RIGHTS_BY_API': {
    code: 11001,
    message: 'This API have not any user Rights.'
  },
  'ERR_API_URL': {
    code: 11002,
    message: 'API URL Is Not Valid.'
  },
  'ERR_ACCESSTOKEN': {
    code: 11003,
    message: 'accessToken is undefined.'
  },
  'ERR_UDID': {
    code: 11004,
    message: 'uDID is undefined.'
  },
  'ERR_USER_TYPE': {
    code: 11005,
    message: 'User Type is not valid.'
  },
  'VALID_USER_RIGHTS': {
    code: 11006,
    message: 'User Rights Is Valid.'
  },
  'ERR_USER_RIGHTS': {
    code: 11007,
    message: 'User Rights Is Not Match.'
  },
  'ERR_USER_INFO': {
    code: 11008,
    message: 'User Info is undefined.'
  },
}

var otherMessage = {
  'ERR_INVALID_IMAGEUPLOAD_ADD_REQUEST': {
    code: 12009,
    message: 'Invalid Image Upload Request.'
  },
  'ERR_INVALID_MEDIA_UPLOAD_REQUEST': {
    code: 12010,
    message: 'Invalid file upload request.'
  },
  'ERR_ACTIVE_PATH_NOT_FOUND': {
    code: 12011,
    message: 'Active path not found.'
  },
  'ERR_INVALID_GET_IMAGE_REQUEST': {
    code: 12012,
    message: 'Invalid get Image request'
  },
  'ERR_IMAGE_NOT_UPLOADED': {
    code: 12013,
    message: "Image not uploaded."
  },
  'ERR_INVALID_ACTIVE_BODY_REQUEST': {
    code: 12014,
    message: "Invalid Active or In-Active api Request."
  },
  'ERR_INVALID_TABLE_ACTIVE_REQUEST': {
    code: 12015,
    message: "Invalid Table Active or In-Active Request"
  },
  'ACTIVE_SUCCESS': {
    code: 12017,
    message: "Active status changed Successfully."
  },
  'INVALID_ACTIVE_PARAM': {
    code: 12018,
    message: "Invalid active status."
  },
  'ERR_INVALID_ADD_ROLE_REQUEST': {
    code: 12019,
    message: "Invalid get role request."
  },
  'ROLE_CREATED_SUCCESSFUL': {
    code: 12020,
    message: "Role created successfully."
  },
  'ROLE_UPDATED_SUCCESSFUL': {
    code: 12021,
    message: "Role updated successfully."
  },
  'ERR_CREATE_AVTIVE_PATH_FOLDER': {
    code: 12022,
    message: 'Error while creating active path folder for moving image'
  },
  'ERR_CREATE_THUMB_PATH_FOLDER': {
    code: 12023,
    message: 'Error while creating thumb path folder for moving image'
  },
  'ERR_INVALID_GET_MEDIA_REQUEST': {
    code: 12024,
    message: "Invalid get media request."
  }
};

var categoryMessages = {
    'ERR_CATEGORY_ALREADY_EXIST': {
        code: 18001,
        message: 'Category is already exist'
    },
    'ERR_CATEGORY_CODE_EXIST': {
        code: 18002,
        message: 'Category code is already exist'
    },
    'ERR_CATEGORY_NAME_EXIST': {
        code: 18003,
        message: 'Category name is already exist'
    },
    'CATEGORY_ADD_SUCCESS': {
        code: 18004,
        message: 'Category added successfully'
    },
    'ERR_NO_CATEGORY_FOUND': {
        code: 18005,
        message: 'No category found'
    },
    'ERR_INVALID_SEARCH_CATEGORY_REQUEST': {
        code: 18006,
        message: 'Invalid search category request'
    },
    'CATEGORY_UPDATE_SUCCESS': {
        code: 18007,
        message: 'Category updated successfully'
    },
    'ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_REMOVE': {
        code: 18008,
        message: 'This CategoryID is not Valid.'
    },
    'MSG_CATEGORY_REMOVE_SUCCESSFULLY': {
        code: 18009,
        message: 'Category Remove successfully.'
    },
    'ERR_REQUESTED_USER_NO_PERMISSION_OF_CATEGORY_UPDATE': {
        code: 18010,
        message: 'This CategoryID is not Valid.'
    },
    'ERR_CATEGORY_EXIST': {
        code: 18022,
        message: 'Category is Exist.'
    }

};

var tableCodeMapping = [{
  code: "3",
  tableName: "tbl_UserMaster",
  pk_idField: "pk_userID"
},{
  code: "2",
  tableName: "tbl_CategoryMaster",
  pk_idField: "pk_categoryID"
}];
module.exports={
    requestMessages:requestMessages,
    appConfig: applicationConfiguration,
    userRole:userRole,
    userMessages:userMessages,
    userRightsByApiMessage:userRightsByApiMessage,
    userType:userType,
    otherMessage:otherMessage,
    tableCodeMapping:tableCodeMapping,
    categoryMessages:categoryMessages,
}
