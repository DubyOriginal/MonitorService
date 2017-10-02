/**
 * Created by dvrbancic on 16/09/2017.
 */
/**
 * Created by dvrbancic on 16/09/2017.
 */

//var db = require('mysql');

const DBHelper = require('./DBHelper');
const BasicUtils = require('./BasicUtils');

const moment = require('moment');
const APP_SESSION_TIMEOUT_CHECK = 1000 * 60 * 60 // One hour time



class MonitorApi {

  getAllSensorsData(callback){
    console.log("MonitorApi: getAllSensorsData");

    let dbHelper = new DBHelper();
    let basicUtils = new BasicUtils();

    const sql = "SELECT \
      monitor_data.id, \
      FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%m:%s') as rtimestamp, \
        device_name, \
        sensor_id, \
        sensor_type, \
        sensor_mid, \
        sensor_name, \
        sensor_value \
      FROM monitor_db.monitor_data \
      LEFT JOIN user_params ON monitor_data.user_id = user_params.id \
      LEFT JOIN device_params ON monitor_data.device_id = device_params.id \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 20;";
    dbHelper.query(sql, [], function(result, error) {
      if (!error && result) {
        if (callback){
          callback(result);
          console.log("MonitorApi: getAllSensorsData DATA LOADED - cnt: " + result.length);
          basicUtils.printJOSNRows(result);
        }


      }else{
        console.log("MonitorApi: getAllSensorsData - SOME ERROR!");
      }
    });
  };

  getSensorData(sensor_id){
    console.log("MonitorApi: getSensorData LIMIT 20");

    let dbHelper = new DBHelper();
    let basicUtils = new BasicUtils();

    const sql = "SELECT \
      monitor_data.id, \
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
      FROM monitor_db.monitor_data \
      LEFT JOIN user_params ON monitor_data.user_id = user_params.id \
      LEFT JOIN device_params ON monitor_data.device_id = device_params.id \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      WHERE sensor_id like ? \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 20;";
    dbHelper.query(sql, [sensor_id], function(result, error) {
      if (!error && result) {
        console.log("MonitorApi: getSensorData DATA LOADED - cnt: " + result.length);
        //basicUtils.printJOSNRows(result);

      }else{
        console.log("MonitorApi: getSensorData - SOME ERROR!");
      }
    });
  };

  getAllSensorParams(callback){
    console.log("MonitorApi: getAllSensorParams");

    let dbHelper = new DBHelper();

    const sql = "SELECT * FROM monitor_db.sensor_params;";
    dbHelper.query(sql, [], function(result, error) {
      if (!error && result) {
        console.log("MonitorApi: getAllSensorParams:");
        console.log("\t " + JSON.stringify(result));
        if (callback) {
          callback(result);
        }
      }else{
        console.log("MonitorApi: getAllSensorParams - SOME ERROR!");
      }
    });
  };

  getLatestSensorValue(sensor_id, callback){
    console.log("MonitorApi: getLatestSensorValue");

    let dbHelper = new DBHelper();

    const sql = "SELECT \
      monitor_data.id, \
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
      FROM monitor_db.monitor_data \
      LEFT JOIN user_params ON monitor_data.user_id = user_params.id \
      LEFT JOIN device_params ON monitor_data.device_id = device_params.id \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      WHERE \
        monitor_data.timestamp = (SELECT MAX(timestamp) FROM monitor_data WHERE sensor_id like ?) \
        AND sensor_id like ?;";
    dbHelper.query(sql, [sensor_id, sensor_id], function(result, error) {
      if (!error && result) {
        console.log("MonitorApi: getLatestSensorValue:");
        console.log("\t " + JSON.stringify(result));
        if (callback) {
          callback(result);
        }
      }else{
        console.log("MonitorApi: getLatestSensorValue - SOME ERROR!");
      }
    });
  };

  getUserData(user_id){
    console.log("MonitorApi: getUserData LIMIT 20");

    let dbHelper = new DBHelper();
    let basicUtils = new BasicUtils();

    const sql = "SELECT \
      monitor_data.id, \
      FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%m:%s') as rtimestamp, \
        user_id, \
        user_name, \
        device_id, \
        device_name, \
        sensor_id, \
        sensor_type, \
        sensor_mid, \
        sensor_name, \
        sensor_value \
      FROM monitor_db.monitor_data \
      LEFT JOIN user_params ON monitor_data.user_id = user_params.id \
      LEFT JOIN device_params ON monitor_data.device_id = device_params.id \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      WHERE user_id like ? \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 20;";
    dbHelper.query(sql, [user_id], function(result, error) {
      if (!error && result) {
        console.log("MonitorApi: getUserData DATA LOADED - cnt: " + result.length);
        //basicUtils.printJOSNRows(result);

      }else{
        console.log("MonitorApi: getUserData - SOME ERROR!");
      }
    });
  };


  /*{
   "user_id":"DY001",
   "device_id":"123456",
   "sensors":[{"sensor_id":"11 33 55 77","sensor_type":"temp","sensor_value":"22.22"},{"sensor_id":"11 33 55 77","sensor_type":"hum","sensor_value":"60"}]
   }
   */
  storeDeviceData(user_id, device_id, sensors){
    console.log("MonitorApi: storeDeviceData");

    let dbHelper = new DBHelper();

    if (sensors){
      var writeSensorValue = (i) => {
        if (i >= sensors.length) {
          return
        }

        var sensor_id = sensors[i].sensor_id;
        var sensor_value = sensors[i].sensor_value;
        var timestamp = moment().unix();
        console.log("MonitorApi: storeDeviceData[" + i + "] -> sensor_id: " + sensor_id + ", sensor_value: " + sensor_value);

        //var sql = "INSERT INTO monitor_data (id, timestamp, user_id, device_id, sensor_id, sensor_type, sensor_value) VALUES (null,'" + timestamp + "', '" + user_id + "', '" + device_id + "', '" + sensor_id + "', '" + sensor_type + "', '" + sensor_value + "');";
        var sql = "INSERT INTO monitor_data (id, timestamp, user_id, device_id, sensor_id, sensor_value) VALUES (null, ?, ?, ?, ?, ?);";
        dbHelper.query(sql, [timestamp, user_id, device_id, sensor_id, sensor_value], function(result, error) {
          writeSensorValue(i + 1);
        });
      }

      writeSensorValue(0)
    }else{
      console.log("no sensors");
    }
  };
}


module.exports = MonitorApi;
