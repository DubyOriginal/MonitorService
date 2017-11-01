/**
 * Created by dvrbancic on 16/09/2017.
 */
'use strict'
//var config = require('config.json')('./config/live.json');
//var config = require('config.json')('./config/develop.json');
var Config = require('../config/Config.js'), config = new Config();
var mysql = require('mysql');

/*
 DB    - monitor_db
 TABLE - monitor_data
 */

var logDBConnectInfo = function() {
  console.log("######### : " + JSON.stringify(config.database));
  console.log("DATABASE: \n    host: ", config.database.host, ":", config.database.port, "\n    name: ", config.database.database);
}
logDBConnectInfo();

var dbPool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
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
