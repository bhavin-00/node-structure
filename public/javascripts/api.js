(function () {
  /**
   * CBT:this function create proper api URL to make call to server
   * ex: localhost:3000/api/v1/user/add-user
   * @param  {[type]} api [description]
   * @return {[type]}     [description]
   */
  function createApiUrl(api) {
    return window.location.origin + Constants.Api.baseUrl + api;
  }
  /**
   * Foolowing get,post,delete,put methods are used to make api call on server
   * @param  {[type]}   api      [description]
   * @param  {[type]}   headers  [description]
   * @param  {[type]}   data     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function post(api, headers, data, callback) {
    commonRequest('POST', api, headers, data, callback);
  }

  function get(api, headers, callback) {
    commonRequest('GET', api, headers, null, callback);
  }

  function put(api, headers, data, callback) {
    commonRequest('PUT', api, headers, data, callback);
  }

  function remove(api, headers, data, callback) {
    commonRequest('DELETE', api, headers, data, callback);
  }
  /**
   * CBT:common function to make API call to server
   * @param  {[type]}   type     [description]
   * @param  {[type]}   api      [description]
   * @param  {[type]}   headers  [description]
   * @param  {[type]}   data     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function commonRequest(type, api, headers, data, callback) {
    var request = {
      type: type,
      beforeSend: function (request) {
        commonHeaderHandler(request, headers);
      },
      url: createApiUrl(api),
      success: function (res) {
        commonResponseHandler(res, callback);
      },
      error: function (xhr, textStatus, errorThrown) {
        commonErrorHandler(xhr, textStatus, errorThrown, callback);
      }
    };
    if (data) {
      request.contentType = "application/json";
      request.data = JSON.stringify(data);
    }
    $.ajax(request);
  }
  /**
   * CBT:common function to handle response from server
   * @param  {[type]}   res      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function commonResponseHandler(res, callback) {
    if (res.status == false) {
      callback(res, null);
    } else {
      callback(null, res);
    }
  }
  /**
   * CBT:common function to create header for API requset
   * @param  {[type]} request [description]
   * @param  {[type]} headers [description]
   * @return {[type]}         [description]
   */
  function commonHeaderHandler(request, headers) {
    for (var key in headers) {
      if (headers.hasOwnProperty(key)) {
        request.setRequestHeader(key, headers[key]);
      }
    }
    request.setRequestHeader("api-key", Constants.Api.apiKey);
    request.setRequestHeader("udid", getUDID());
    request.setRequestHeader("device-type", getDeviceType());
  }
  /**
   * CBT:common error handeler function
   * @param  {[type]}   xhr         [description]
   * @param  {[type]}   textStatus  [description]
   * @param  {[type]}   errorThrown [description]
   * @param  {Function} callback    [description]
   * @return {[type]}               [description]
   */
  function commonErrorHandler(xhr, textStatus, errorThrown, callback) {
    if (xhr.status == 401) {
      LocalPreference.delete(Constants.User.currentUser);
      LocalPreference.delete(Constants.User.authToken);
      Cookies.remove(Constants.User.authToken);
      window.location.href = '/';
      return;
    }
    var error = {
      status: false,
      error: {
        code: xhr.status,
        message: errorThrown
      }
    };
    if (callback != undefined && typeof callback === 'function') {
      callback(error, null);
    }
  }
  /**
   * CBT:get Device type
   * @return {[type]} [description]
   */
  function getDeviceType() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
      (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
          (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


    if (Sys.ie) return ('IE: ' + Sys.ie);
    if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
    if (Sys.opera) return ('Opera: ' + Sys.opera);
    if (Sys.safari) return ('Safari: ' + Sys.safari);
    return "web";
  }
  /**
   * CBT:get device id for make API Call o server
   * @return {[type]} [description]
   */
  function getUDID() {
    return window.navigator.userAgent.replace(/\D+/g, '');
  }

  var headerSetting = {
    "api-key": Constants.Api.apiKey,
    "UDID": getUDID(),
    "device-type": getDeviceType(),
    "Authorization": $.cookie(Constants.User.authToken)
  };

  Api = {
    post: post,
    get: get,
    put: put,
    remove: remove
  }

  CommonFunction = {
    createApiUrl: createApiUrl,
    getDeviceType: getDeviceType,
    getUDID: getUDID
  }

  HeaderSettings = {
    headerSetting: headerSetting
  }

})();
