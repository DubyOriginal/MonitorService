/**
 * Created by dvrbancic on 16/09/2017.
 */
'use strict'
var mysql = require('mysql');
/*
 DB    - monitor_db
 TABLE - monitor_data
 */

var dbPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'monitor_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

class DBHelper {

  query(sql, params, callback) {
    if (!params) params = []

    dbPool.getConnection((error, connection) => {
      if (error) {
        console.log(error)
        if (callback) callback(null, error)
      } else {
        connection.query(sql, params, (error, result) => {
          if (error) {
            console.log("DBHelper: query error -> " + JSON.stringify(error));
            //console.log(error)
          }

          if (callback) {
            callback(result, error)
          }
          connection.release()
        })
      }
    })
  }


}


module.exports = DBHelper;
