/**
 * Created by dvrbancic on 16/09/2017.
 */
'use strict'
var configLive = require('config.json')('./config/live.json');
var configDevelop = require('config.json')('./config/develop.json');
var mysql = require('mysql');

/*
 DB    - monitor_db
 TABLE - monitor_data
 */

var logDBConnectInfo = function() {
  console.log("######### : " + JSON.stringify(configLive.database));
  console.log("DATABASE: \n    host: ", configLive.database.host, ":", configLive.database.port, "\n    name: ", configLive.database.database);
}
logDBConnectInfo();

var dbPool = mysql.createPool({
  host: configLive.database.host,
  port: configLive.database.port,
  user: configLive.database.user,
  password: configLive.database.password,
  database: configLive.database.database,
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
