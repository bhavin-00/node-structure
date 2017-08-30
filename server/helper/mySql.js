var debug = require('debug')('server:helper:mySql');
var connectionIdentifier = require('node-database-connectors');
var connection = require('./connection');
var config = require('../../config');


function prepareQuery(queryJSON) {

  return new Promise(function (resolve, reject) {
    try {
      var objConnection = connectionIdentifier.identify(config.dbConfig);
      var query = objConnection.prepareQuery(queryJSON);
      resolve({
        status: true,
        content: query
      });
    } catch (ex) {
      reject({
        status: false,
        error: ex
      });
    }
  })
}

exports.executeQuery = async function (queryJSON, cb) {
  try {
    var result = await prepareQuery(queryJSON)
    var rawQuery = result.content;
    debug(rawQuery);
    var queryResult = await connection.executeRawQuery(rawQuery);
    if (cb) {
      cb(queryResult);
    }
    else {
      return queryResult;
    }
  }
  catch (ex) {
    throw ex;
  }
};

// exports.executeRawQuery = function(rawQuery, cb) {
//   debug(rawQuery);
//   connection.executeRawQuery(rawQuery, cb);
// };

function prepareMultipleQuery(queryArrayJSON) {

  return new Promise(function (resolve, reject) {
    try {
      var rawQueryArray = [];
      prepareMultipleQueryRecursion(0);

      function prepareMultipleQueryRecursion(index) {
        if (queryArrayJSON.length > index) {
          var queryJSON = queryArrayJSON[index];
          var result = prepareQuery(queryJSON);

          var rawQuery = result.content;
          debug(rawQuery);
          rawQueryArray.push(rawQuery);
          prepareMultipleQueryRecursion((index + 1));

        } else {
          resolve({
            status: true,
            content: rawQueryArray
          })
        }
      }
    } catch (ex) {
      reject({
        status: false,
        error: ex
      });
    }
  })



}


exports.executeQueryWithTransactions = async function (queryArrayJSON) {
  try {
    var result = await prepareMultipleQuery(queryArrayJSON);
    var rawQueryArray = result.content;
    debug(rawQuery);
    var queryResult = await connection.executeRawQueryWithTransactions(rawQuery);
    return queryResult;
  }
  catch (ex) {
    throw ex;
  }
};

//
// exports.executeRawQueryWithTransactions = function(rawQueryArray, cb) {
//   debug(rawQueryArray);
//   connection.executeRawQueryWithTransactions(rawQueryArray, cb);
// };
