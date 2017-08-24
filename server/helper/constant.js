/**
 * Status codes and messages
 */
var status = {
  // database errors
  'DB_CONN_ERR': {
    code: 10000,
    message: 'Cannot connect to database'
  },
  'DB_QUERY_ERR': {
    code: 10001,
    message: 'Cannot execute query'
  },
  'ER_DUP_ENTRY': {
    code: 10002,
    message: 'Error dublicate entry'
  },
  'MSG_TRANSACTION_SUCCESS': {
    code: 10003,
    message: 'Transaction completd successfully!'
  }
};

/**
 * Constants used in modules
 * @type {Object}
 */
var constant = {
  status: status
};

module.exports = constant;
