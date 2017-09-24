/**
 * Created by dvrbancic on 16/09/2017.
 */
/**
 * Created by dvrbancic on 16/09/2017.
 */

//var db = require('mysql');


const APP_SESSION_TIMEOUT_CHECK = 1000 * 60 * 60 // One hour time



class MonitorApi {

  constructor(app) {
    console.log("MonitorApi initialized");

    this.app = app;

    //this.moment = require('moment')
    //this.request = require('request')
    //this.fs = require('fs');

    //this.schedule(function () {
    //  console.log("test scheduler");
    //}, APP_SESSION_TIMEOUT_CHECK);
  };

  readValues(){
    console.log("MonitorApi: readValues");
    const DBHelper = require('./DBHelper');
    var dbHelper = new DBHelper();
    dbHelper.readValues();
  };


  /*{
   "sensors":[{"sensor_id":"3563547","sensor_value":"1234"},{"sensor_id":"3563547","sensor_value":"5678"}],
   "user_id":"DY001",
   "device_id":"123456"}
   */
  writeValues(user_id, device_id, sensors){
    console.log("MonitorApi: writeValues");
    const DBHelper = require('./DBHelper');
    var dbHelper = new DBHelper();

    if (sensors){
      var writeSensorValue = (i) => {
        if (i >= sensors.length) {
          return
        }

        var sensor_id = sensors[i].sensor_id;
        var sensor_value = sensors[i].sensor_value;
        var sensor_type = sensors[i].sensor_type;
        console.log("MonitorApi: writeValues[" + i + "] -> sensor_id: " + sensor_id + ", sensor_type: " + sensor_type + ", sensor_value: " + sensor_value);

        dbHelper.writeValues(user_id, device_id, sensor_id, sensor_type, sensor_value, () => {
          writeSensorValue(i + 1);
        });
      }

      writeSensorValue(0)
    }else{
      console.log("no sensors")
    }
  };



  //new this.testDB();
}

//var monitor_api = new MonitorApi();
//module.exports = monitor_api.testDB();

module.exports = MonitorApi;
