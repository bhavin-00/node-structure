var debug = require('debug')('server:helper:mySql');
var connectionIdentifier = require('node-database-connectors');
var connection = require('./connection');
var config = require('../../config');


function prepareQuery(queryJSON) {

    return new Promise(function(resolve,reject){
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

exports.executeQuery = async function(queryJSON,cb) {
  try{
    var result = await prepareQuery(queryJSON)
    var rawQuery = result.content;
    debug(rawQuery);
    var queryResult = await connection.executeRawQuery(rawQuery);
    if(cb){
        cb(queryResult);
    }
    else{
      return queryResult;
    }
  }
  catch(ex){    
    throw ex;
  }
};

// exports.executeRawQuery = function(rawQuery, cb) {
//   debug(rawQuery);
//   connection.executeRawQuery(rawQuery, cb);
// };

// function prepareMultipleQuery(queryArrayJSON, cb) {
//   var rawQueryArray = [];
//   prepareMultipleQueryRecursion(0);
//
//   function prepareMultipleQueryRecursion(index) {
//     if (queryArrayJSON.length > index) {
//       var queryJSON = queryArrayJSON[index];
//       prepareQuery(queryJSON, function(result) {
//         if (result.status === false) {
//           cb(result);
//           return;
//         } else {
//           var rawQuery = result.content;
//           debug(rawQuery);
//           rawQueryArray.push(rawQuery);
//           prepareMultipleQueryRecursion((index + 1));
//         }
//       });
//     } else {
//       cb({
//         status: true,
//         content: rawQueryArray
//       })
//     }
//   }
// }
//
// exports.executeQueryWithTransactions = function(queryArrayJSON, cb) {
//   prepareMultipleQuery(queryArrayJSON, function(result) {
//     if (result.status === false) {
//       cb(result);
//     } else {
//       var rawQueryArray = result.content;
//       connection.executeRawQueryWithTransactions(rawQueryArray, cb);
//     }
//   });
// };
//
// exports.executeRawQueryWithTransactions = function(rawQueryArray, cb) {
//   debug(rawQueryArray);
//   connection.executeRawQueryWithTransactions(rawQueryArray, cb);
// };
