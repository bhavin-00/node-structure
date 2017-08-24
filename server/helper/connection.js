var mysql = require('mysql');
var config = require('../../config');
var constant = require('./constant');
var debug = require('debug')('server:helper:connection');

var connectionpool = mysql.createPool(config.dbConfig);

/**
 * Executes raw query
 * @param  {string}   query raw query
 * @param  {Function} cb    callback function with response
 * @api private
 */
exports.executeRawQuery = function(query, cb) {
  //debug('constants: ', constant);
  connectionpool.getConnection(function(err, connection) {
    if (err) {
      var errStatus = constant.status['DB_CONN_ERR'];
      // debug('db-conn-err: ', err);
      cb({
        status: false,
        error: errStatus
      });
      return;
    }
    connection.query(query, function(err, result) {
      if (err) {
        debug(err);
        if (err.code === "ER_DUP_ENTRY") {
          cb({
            status: false,
            error: constant.status.ER_DUP_ENTRY
          });
        } else {
          var errStatus = constant.status['DB_QUERY_ERR'];
          cb({
            status: false,
            error: errStatus
          });
        }
        connection.release();
        return;
      }
      cb({
        status: true,
        content: result
      });
      connection.release();
    }); // END query
  }); // END connection
};

exports.executeRawQueryWithTransactions = function(querys, cb) {
  connectionpool.getConnection(function(err, connection) {
    if (err) {
      var errStatus = constant.status['DB_CONN_ERR'];
      cb({
        status: false,
        error: errStatus
      });
      return;
    }

    connection.beginTransaction(function(err) {
      if (err) {
        var errStatus = constant.status['DB_CONN_ERR'];
        cb({
          status: false,
          error: errStatus
        });
        return;
      }
      executeRawQueryRecursion(0);
      function executeRawQueryRecursion(index) {
        if (querys.length > index) {
          var query = querys[index];
          connection.query(query, function(err, result) {
            if (err) {
              debug(err);
              connection.rollback();
              connection.release();
              var errStatus = constant.status['DB_QUERY_ERR'];
              cb({
                status: false,
                error: errStatus
              });
              return;
            } else {
              executeRawQueryRecursion((index + 1));
            }
          }); // END connection.query
        } else {
          connection.commit(function(err) {
            if (err) {
              connection.rollback();
              connection.release();
              var errStatus = constant.status['DB_QUERY_ERR'];
              cb({
                status: false,
                error: errStatus
              });
              return;
            }
			connection.release();
            cb({
              status: true,
              content:  constant.status.MSG_TRANSACTION_SUCCESS
            });            
            debug('Transaction success!');
          }); // end connection.commit
        }
      } // END executeRawQueryRecursion
    }); // END beginTransaction
  }); // END connection
};
