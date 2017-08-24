var debug = require('debug')('server:helper:sendsms');
var queryString = require('querystring');
var common = require('../api/v1/common');
var config = require('../../config');
var smsConfig = config.smsConfig;


function sendSMS(destination, messageType, messageData, cb) {
  debug("sendsms -> sendSMS");
  var http = require('http');
  var url = smsConfig.URL;
  var params = {};
  params['aid'] = smsConfig.params.aid;
  params['pin'] = smsConfig.params.pin;
  params['mnumber'] = destination;
  params['message'] = common.generatingTemplate(smsConfig.messageTemplate['OTP'], messageData);
  params['msgType'] = smsConfig.params.msgType;
  params['signature'] = smsConfig.params.signature;
  var sendSMSurl = url + '?' + queryString.stringify(params);
  var options = {
    host: 'http://luna.a2wi.co.in/',
    path: (sendSMSurl)
  };
  if (smsConfig.proxyURL != undefined || smsConfig.proxyPORT != undefined) {
    options["host"] = smsConfig.proxyURL;
    options["port"] = smsConfig.proxyPORT;
  }
  debug(common.generatingTemplate(smsConfig.messageTemplate['OTP'], messageData));
  if (smsConfig.test === false) {
    http.get(options, function(res) {
      if (res.statusCode == 200) {
        if (cb != undefined) {
          cb({
            status: true
          });
        } else {
          debug(responseStatus.message);
        }
      } else {
        if (cb != undefined) {
          debug(res.statusCode);
          cb({
            status: false
          });
        } else {
          debug(err);
        }
      }
      //debug("Got response: " + res.statusCode);
    }).on('error', function(e) {
      //debug("Got error: " + e.message);
      if (cb != undefined) {
        debug(e);
        cb({
          status: false
        });
      } else {
        debug(err);
      }
    });
  } else {
    cb({
      status: true
    });
  }
}

module.exports = {
  sendSMS: sendSMS,
  smsConfig: smsConfig
};
