/**
 * Created by dvrbancic on 16/09/2017.
 */
'use strict'
var mysql = require('mysql');
/*
 DB    - monitor_db
 TABLE - monitor_sensor
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
        connection.query(sql, params, (error, result)=>{
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

  /*
  readValues() {
    dbPool.connect(function (err) {
      if (err) {
        throw err;
      }
      const sql = "SELECT \
      monitor_sensor.id, \
      FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%m:%s') as rtimestamp, \
        timestamp, \
        user_id, \
        user_name, \
        device_id, \
        device_name, \
        sensor_id, \
        sensor_type, \
        sensor_mid, \
        sensor_name, \
        sensor_value \
      FROM monitor_db.monitor_sensor \
      LEFT JOIN user_data ON monitor_sensor.user_id = user_data.id \
      LEFT JOIN device_data ON monitor_sensor.device_id = device_data.id \
      LEFT JOIN sensor_data ON monitor_sensor.sensor_id = sensor_data.id;";
      dbPool.query("SELECT * FROM monitor_sensor", function (err, result, fields) {
        if (err == null) {
          if (result && result.length > 0) {
            console.log("DB -> row[0] " + JSON.stringify(result[0]));
          } else {
            console.log("DB -> there is no DATA!");
          }
        } else {
          console.log("DB -> ERR -> " + JSON.stringify(err));
        }
      });
    });
  }

  writeValues(user_id, device_id, sensor_id, sensor_type, sensor_value, callback) {
     dbPool.connect(function (err) {
     if (err) {
     console.error('error connecting: ' + err.stack);
     if (callback) callback();
     throw err;
     }
     var moment = require('moment');
     var timestamp = moment().unix();
     //console.log("VALUES TO BE INSERT ->");
     //console.log("   timestamp: " + timestamp);
     //console.log("   user_id: " + user_id);
     //console.log("   device_id: " + device_id);
     //console.log("   sensor_value: " + sensor_value);

     //INSERT INTO monitor_sensor (id, timestamp, user_id, device_id, sensor_id, sensor_value) VALUES (null,'1505756983', 'DY001', '123456', '3563547', '4433');
     var sql = "INSERT INTO monitor_sensor (id, timestamp, user_id, device_id, sensor_id, sensor_type, sensor_value) VALUES (null,'" + timestamp + "', '" + user_id + "', '" + device_id + "', '" + sensor_id + "', '" + sensor_type + "', '" + sensor_value + "');";
     //console.log("   sql: " + sql);
     mySqlConnection.query(sql, function (err, result) {
     if (err) throw err;
     //console.log("1 record inserted");
     if (callback) callback();
     });
     });
  }*/

}


module.exports = DBHelper;
