/**
 * Created by dvrbancic on 16/09/2017.
 */
/**
 * Created by dvrbancic on 16/09/2017.
 */

//var db = require('mysql');

const DBHelper = require('./DBHelper');
const FCMHelper = require('./FCMHelper');
const BasicUtils = require('./BasicUtils');
const PhysicsCalc = require('./PhysicsCalc');
var Config = require('../config/Config.js'), config = new Config();

const moment = require('moment');
const APP_SESSION_TIMEOUT_CHECK = 1000 * 60 * 60 // One hour time

let fcmHelper = new FCMHelper();

const ERR_CODE_DB_GET_TOKEN_FOR_ORIGIN = 'ERR_CODE_DB_GET_TOKEN_FOR_ORIGIN'
const ERR_CODE_NO_TOKEN_FOR_ORIGIN = 'ERR_CODE_NO_TOKEN_FOR_ORIGIN';

class MonitorApi {

    constructor() {
        console.log("MonitorApi initialized");
    }

    getDataCount(callback){
        console.log("MonitorApi: getDataCount");

        let dbHelper = new DBHelper();
        //const sql = "SELECT COUNT(*) as data_cnt FROM monitor_db.monitor_data;";
        const sql = "SELECT COUNT(*) as measurement_cnt, (SELECT COUNT(*) as row_cnt FROM monitor_db.monitor_data) as row_cnt FROM monitor_db.monitor_data WHERE sensor_id = 104;"
        dbHelper.query(sql, [], function (result, error) {

            console.log("MonitorApi: getDataCount -> " + JSON.stringify(result));
            if (!error && result) {
                let data_count = result[0];
                if (callback) {
                    callback(data_count);
                } else {
                    console.log("MonitorApi: getDataCount - callback is NULL!");
                }
            } else {
                console.log("MonitorApi: getDataCount - SOME ERROR!");
            }
        });

    }

    getAllSensorsData(callback) {
        console.log("MonitorApi: getAllSensorsData");

        let dbHelper = new DBHelper();
        let basicUtils = new BasicUtils();

        const sql = "SELECT \
        monitor_data.id, \
        FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, \
        timestamp, \
        user_id, \
        user_name, \
        device_id, \
        device_name, \
        sensor_id, \
        sensor_type, \
        sensor_mid, \
        sensor_address, \
        sensor_name, \
        sensor_value \
      FROM monitor_db.monitor_data \
      LEFT JOIN user_params ON monitor_data.user_id = user_params.id \
      LEFT JOIN device_params ON monitor_data.device_id = device_params.id \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 40;";
        dbHelper.query(sql, [], function (result, error) {
            console.log("MonitorApi: getAllSensorsData DATA LOADED");
            if (!error && result) {
                if (callback) {
                    callback(result);
                    //console.log("MonitorApi: getAllSensorsData DATA LOADED - cnt: " + result.length);
                    //basicUtils.printJOSNRows(result);
                } else {
                    console.log("MonitorApi: getAllSensorsData - callback is NULL!");
                }
            } else {
                console.log("MonitorApi: getAllSensorsData - SOME ERROR!");
            }
        });
    };

    getSensorData(sensor_id, callback) {
        console.log("MonitorApi: getSensorData LIMIT 40");

        let dbHelper = new DBHelper();
        let basicUtils = new BasicUtils();

        const sql = "SELECT \
      monitor_data.id, \
      FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, \
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
      WHERE sensor_id = ? \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 4000;";
        dbHelper.query(sql, [sensor_id], function (result, error) {
            if (!error && result) {
                console.log("MonitorApi: getSensorData DATA LOADED - cnt: " + result.length);
                //basicUtils.printJOSNRows(result);
                if (callback) {
                    callback(result);
                } else {
                    console.log("MonitorApi: getSensorData - callback is NULL!");
                }
            } else {
                console.log("MonitorApi: getSensorData - SOME ERROR!");
            }
        });
    };

    getSensorDataWithRange(sensor_id, fromuxdate, touxdate, callback) {
        console.log("MonitorApi: getSensorDataWithRange: ");

        let dbHelper = new DBHelper();
        let basicUtils = new BasicUtils();

        let specSensorSQL = (sensor_id > 0) ? ("sensor_id = " + sensor_id) : "true";

        const sql = "SELECT \
        timestamp, \
        sensor_id, \
        sensor_name, \
        sensor_value \
      FROM monitor_db.monitor_data \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      WHERE " + specSensorSQL + " AND \
      ((timestamp >= ?) AND (timestamp < ?)) \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 406000;";
        //console.log("MonitorApi: getSensorDataWithRange -> sql: \n" + sql);
        dbHelper.query(sql, [fromuxdate, touxdate], function (result, error) {
            if (!error && result) {
                console.log("MonitorApi: getSensorDataWithRange DATA LOADED - cnt: " + result.length);
                //basicUtils.printJOSNRows(result);
                if (callback) {
                    callback(result);
                } else {
                    console.log("MonitorApi: getSensorDataWithRange - callback is NULL!");
                }
            } else {
                console.log("MonitorApi: getSensorDataWithRange - SOME ERROR!");
            }
        });
    };

    getConsumptionDataWithRange(fromUxTS, toUxTS, callback) {
        console.log("MonitorApi: getConsumptionDataWithRange: [" + fromUxTS + " - " + toUxTS + "]");

        let dbHelper = new DBHelper();
        let basicUtils = new BasicUtils();

        let sID_CKP_POL = 105;
        let sID_CKP_POV = 107;
        let sID_pumpStatus_CKP = 200;
        let sID_pumpStatus_RAD = 201;

        const sql = "SELECT \
        timestamp, \
        sensor_id, \
        sensor_value \
          FROM monitor_db.monitor_data \
          WHERE sensor_id IN(" + sID_CKP_POL + "," + sID_CKP_POV + "," + sID_pumpStatus_CKP + ") AND \
          ((timestamp >= ?) AND (timestamp < ?)) \
          ORDER BY monitor_data.timestamp DESC;";
        //console.log("MonitorApi: getSensorDataWithRange -> sql: \n" + sql);
        dbHelper.query(sql, [fromUxTS, toUxTS], function (consumptionData, error) {
            if (!error && consumptionData) {
                console.log("MonitorApi: getConsumptionDataWithRange DATA LOADED - cnt: " + consumptionData.length);
                //basicUtils.printJOSNRows(result);
                if (callback) {
                    callback(consumptionData);
                } else {
                    console.log("MonitorApi: getConsumptionDataWithRange - callback is NULL!");
                }
            } else {
                console.log("MonitorApi: getConsumptionDataWithRange - SOME ERROR!");
            }
        });
    };

    getCalculatedConsumptionDataForRange(daysCount, callback) {
        console.log("MonitorApi: getCalculatedConsumptionDataForRange / " + daysCount);

        let physicsCalc = new PhysicsCalc();

        const fNow = new Date();
        //const fNow = new Date("January 17, 2018 11:30:22");
        console.log("MonitorApi: fNow -> " + fNow + "  unixTS -> " + fNow.getTime()/1000);

        //generate date range (10.01 - 16.01 + now)
        var dateRangeArr = [];
        for (var i = daysCount; i >= 0; i -= 1) {
            var tempDate = new Date(fNow);
            tempDate.setDate(fNow.getDate() - i);
            tempDate.setHours(0, 0, 0);
            tempDate.setMilliseconds(0);
            let unixTS = tempDate.getTime()/1000;
            dateRangeArr.push(unixTS);
            console.log("MonitorApi: tempDate[" + i + "]  -> " + tempDate + "  unixTS -> " + unixTS);
        }

        console.log("MonitorApi:  dateRangeArr.cnt -> " + dateRangeArr.length);

        let fromUxTS = dateRangeArr[0];
        let toUxTS = dateRangeArr[daysCount];

        //get data for RANGE
        //-------------------------------------------------
        var parsedData = [];
        this.getConsumptionDataWithRange(fromUxTS, toUxTS, consumptionData => {
            if (consumptionData != null) {
                let cdCnt = consumptionData.length;
                console.log("MonitorApi: getCalculatedConsumptionDataForRange - consumptionData: \n   0:  " + JSON.stringify(consumptionData[0]));

                for (var i = 0; i < cdCnt-1; i += 3) {
                    var row = {ts: 0, ckp_pol:0, ckp_pov:0, pow:0};
                    let valCKP_POL = consumptionData[i].sensor_value;
                    let valCKP_POV = consumptionData[i+1].sensor_value;
                    let pumpStatus_CKP = consumptionData[i+2].sensor_value;
                    row.ckp_pol = valCKP_POL;
                    row.ckp_pov = valCKP_POV;
                    if (pumpStatus_CKP == "0"){     //calculatePower only if PUMP in ON!
                        row.pow = physicsCalc.calculatePower(valCKP_POL, valCKP_POV);
                    }
                    row.ts = consumptionData[i].timestamp;
                    parsedData.push(row);
                }

                console.log("MonitorApi:  parsedData.cnt -> " + parsedData.length);
                console.log("MonitorApi: getConsumptionDataWithRange.parsedData -> ");
                console.log("MonitorApi:  " + JSON.stringify(parsedData[0]));

                var rowArr = new Array(daysCount);    //range 7 days

                //dateRangeArr
                for (var j = 0; j < daysCount; j += 1) {
                    var rangeFrom = dateRangeArr[j];
                    var rangeTo = dateRangeArr[j + 1];

                    rowArr[j] = [];
                    for (var i = 0; i < parsedData.length-1; i += 1) {
                        let tmpTS = parsedData[i].ts;
                        let tmpPow = parsedData[i].pow;
                        if ((tmpTS > rangeFrom) && (tmpTS < rangeTo)){
                            var obj = {ts:tmpTS, pow:tmpPow};
                            rowArr[j].push(obj);
                        }
                    }
                }

                console.log("MonitorApi:  rowArr.cnt -> " + rowArr.length);
                console.log("MonitorApi: -----------------------------------------------");
                //console.log("MonitorApi:  FINAL ARR: " + JSON.stringify(rowArr));

                //console.log("MonitorApi:  rowArr[0] -> " + JSON.stringify(rowArr[0]));
                //console.log("MonitorApi: ----");


                let result = [];
                for (var i = 0; i < daysCount; i += 1) {
                    var energyJx = physicsCalc.calculateEnergy(rowArr[i]);
                    var energykWhx = physicsCalc.convertJ2Wh(energyJx);
                    var massx = physicsCalc.convertJ2Mass(energyJx);

                    var energyFWhx =  physicsCalc.nFormatter(energykWhx);

                    var finalTS = dateRangeArr[i];
                    result.push({"ts":finalTS, "value":energyJx});
                    console.log("MonitorApi:  energyFWhx[" + i + "] -> " + energyFWhx + "Wh,  mass -> " + massx + "kg,  ts -> " + finalTS);
                }

                /*
                result.push({"ts":1515538800, "value":34});    //10.01 00:00 wen (sri)
                result.push({"ts":1515625200, "value":40});    //11.01 00:00
                result.push({"ts":1515711600, "value":44});    //12.01 00:00
                result.push({"ts":1515798000, "value":37});    //13.01 00:00
                result.push({"ts":1515884400, "value":26});    //14.01 00:00
                result.push({"ts":1515970800, "value":30});    //15.01 00:00
                result.push({"ts":1516057200, "value":52});    //16.01 11:30:22 (now')  (1516060800 -> 0:00)
                */

                if (callback) {
                    callback(result);
                } else {
                    console.log("MonitorApi: getConsumptionDataWithRange - callback is NULL!");
                }


            } else {
                console.log("MonitorApi: getCalculatedConsumptionDataForRange - consumptionData is NULL!");
            }
        });
    }

    getAllSensorParams(callback) {
        console.log("MonitorApi: getAllSensorParams");

        let dbHelper = new DBHelper();

        const sql = "SELECT * FROM monitor_db.sensor_params;";
        dbHelper.query(sql, [], function (result, error) {
            if (!error && result) {
                //console.log("MonitorApi: getAllSensorParams:");
                //console.log("\t " + JSON.stringify(result));
                if (callback) {
                    callback(result);
                }
            } else {
                console.log("MonitorApi: getAllSensorParams - SOME ERROR!");
            }
        });
    };


    getParamsForSensorID(sensor_id, callback) {
        //console.log("MonitorApi: getParamsForSensorID");

        let dbHelper = new DBHelper();

        const sql = "SELECT * FROM monitor_db.sensor_params WHERE id = " + sensor_id + ";";
        dbHelper.query(sql, [], function (result, error) {
            if (!error && result) {
                //console.log("MonitorApi: getParamsForSensorID:");
                //console.log("\t " + JSON.stringify(result));
                if (callback) {
                    callback(result[0]);
                }
            } else {
                console.log("MonitorApi: getParamsForSensorID - SOME ERROR!");
            }
        });
    };

    updateSensorParams(sensor, callback) {
        console.log("MonitorApi: updateSensorParams");

        let dbHelper = new DBHelper();
        //UPDATE `monitor_db`.`sensor_params` SET `sensor_name`='test soba 22' WHERE `id`='102';
        const sql = "UPDATE monitor_db.sensor_params SET id = ?, sensor_type = ?, sensor_mid = ?, sensor_address = ?, sensor_name = ?, alarm_min = ?, alarm_max = ? WHERE id = ?;";
        //console.log("updateSensorParams  SQL: " + sql);
        //console.log("updateSensorParams  sensor: " + JSON.stringify(sensor));
        dbHelper.query(sql, [sensor.id, sensor.sensor_type, sensor.sensor_mid, sensor.sensor_address, sensor.sensor_name, sensor.alarm_min, sensor.alarm_max, sensor.id], function (result, error) {
            if (!error && result) {
                //console.log("MonitorApi: updateSensorParams:");
                //console.log("\t " + JSON.stringify(result));
                if (callback) {
                    callback(result);
                }
            } else {
                console.log("MonitorApi: updateSensorParams - SOME ERROR!");
            }
        });
    };

    getLatestSensorValue(sensor_id, callback) {
        console.log("MonitorApi: getLatestSensorValue");

        let dbHelper = new DBHelper();

        const sql = "SELECT \
      monitor_data.id, \
      FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, \
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
        monitor_data.timestamp = (SELECT MAX(timestamp) FROM monitor_data WHERE sensor_id = ?) \
        AND sensor_id = ?;";
        dbHelper.query(sql, [sensor_id, sensor_id], function (result, error) {
            if (!error && result) {
                console.log("MonitorApi: getLatestSensorValue:");
                console.log("\t " + JSON.stringify(result));
                if (callback) {
                    callback(result);
                }
            } else {
                console.log("MonitorApi: getLatestSensorValue - SOME ERROR!");
            }
        });
    };

    getSchematicSensorData(callback) {
        console.log("MonitorApi: getSchematicSensorData");

        let dbHelper = new DBHelper();
        let basicUtils = new BasicUtils();

        const sql = "SELECT \
      monitor_data.sensor_id, \
      FROM_UNIXTIME(monitor_data.timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, \
        screen_sensor.screen_id, \
        sensor_params.sensor_type, \
        sensor_params.sensor_mid, \
        sensor_params.sensor_name, \
        monitor_data.sensor_value \
      FROM monitor_db.monitor_data \
      LEFT JOIN user_params ON monitor_data.user_id = user_params.id \
      LEFT JOIN device_params ON monitor_data.device_id = device_params.id \
      LEFT JOIN sensor_params ON monitor_data.sensor_id = sensor_params.id \
      RIGHT JOIN monitor_db.screen_sensor ON monitor_db.monitor_data.sensor_id = monitor_db.screen_sensor.sensor_id \
      WHERE \
        monitor_data.timestamp = (SELECT MAX(timestamp) FROM monitor_data) \
      ORDER BY screen_sensor.screen_id ASC";

        dbHelper.query(sql, [], function (result, error) {
            if (!error && result) {
                console.log("MonitorApi: getSchematicSensorData:");
                basicUtils.printJOSNRows(result);
                if (callback) {
                    callback(result);
                }
            } else {
                console.log("MonitorApi: getSchematicSensorData - ERR: " + JSON.stringify(error));
            }
        });
    };

    getSensorByScreenID(screen_id, callback) {
        console.log("MonitorApi: getSensorByScreenID");

        let dbHelper = new DBHelper();

        const sql = "SELECT * FROM screen_sensor WHERE screen_id = ?;";
        dbHelper.query(sql, [screen_id], function (result, error) {
            if (!error && result) {
                console.log("MonitorApi: getSensorByScreenID: " + JSON.stringify(result));
                if (callback) {
                    callback(result);
                }
            } else {
                console.log("MonitorApi: getSensorByScreenID - SOME ERROR!");
            }
        });
    };

    getUserData(user_id) {
        console.log("MonitorApi: getUserData LIMIT 20");

        let dbHelper = new DBHelper();
        let basicUtils = new BasicUtils();

        const sql = "SELECT \
      monitor_data.id, \
      FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, \
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
      WHERE user_id = ? \
      ORDER BY monitor_data.timestamp DESC \
      LIMIT 20;";
        dbHelper.query(sql, [user_id], function (result, error) {
            if (!error && result) {
                console.log("MonitorApi: getUserData DATA LOADED - cnt: " + result.length);
                //basicUtils.printJOSNRows(result);

            } else {
                console.log("MonitorApi: getUserData - SOME ERROR!");
            }
        });
    };

    saveScreenSensor(screen_id, sensor_id, callback) {
        console.log("MonitorApi: saveScreenSensor");

        let dbHelper = new DBHelper();

        var sql = "INSERT INTO screen_sensor (screen_id, sensor_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE screen_id = values(screen_id),  sensor_id = values(sensor_id);";
        dbHelper.query(sql, [screen_id, sensor_id], function (result, error) {
            if (callback) {
                if (result) {
                    callback({status: "success"});
                } else {
                    callback({status: "error"});
                }
            }
        });
    };


    /*{
     "user_id":"DY001",
     "device_id":"123456",
     "sensors":[{"sensor_id":"11 33 55 77","sensor_type":"temp","sensor_value":"22.22"},{"sensor_id":"11 33 55 77","sensor_type":"hum","sensor_value":"60"}]
     }
     */
    storeDeviceData(user_id, device_id, sensors) {
        //console.log("MonitorApi: storeDeviceData");

        let dbHelper = new DBHelper();
        //let fcmHelper = new FCMHelper();

        var alarmedSensorArr = [];

        if (sensors) {
            var writeSensorValue = (i) => {
                if (i >= sensors.length) {
                    //console.log("MonitorApi: alarmedSensorArr -> " + JSON.stringify(alarmedSensorArr));
                    if (alarmedSensorArr.length > 0) {
                        this.sendPushNotification();
                    } else {
                        console.log("MonitorApi: there is no triggered alarms!");
                    }
                    return;
                }

                var sensor_id = sensors[i].sensor_id;
                var sensor_value = sensors[i].sensor_value;
                if (sensor_value <= -127) {
                    sensor_value = "";
                }
                var timestamp = moment().unix();
                //console.log("MonitorApi: storeDeviceData TS -> " + new Date(timestamp).toLocaleDateString());
                //console.log("MonitorApi: storeDeviceData[" + i + "] -> sensor_id: " + sensor_id + ", sensor_value: " + sensor_value);


                this.analyzeSensorsData(user_id, device_id, sensor_id, sensor_value, result => {
                    if (result) {
                        if (result.status == "ALARM") {
                            alarmedSensorArr.push(result);
                            console.log("MonitorApi: analyzeSensorsData.testSensorAlarm result.status -> ALARM");
                        }
                    } else {
                        console.log("MonitorApi: analyzeSensorsData.testSensorAlarm -> result is NULL!");
                    }
                });

                //var sql = "INSERT INTO monitor_data (id, timestamp, user_id, device_id, sensor_id, sensor_type, sensor_value) VALUES (null,'" + timestamp + "', '" + user_id + "', '" + device_id + "', '" + sensor_id + "', '" + sensor_type + "', '" + sensor_value + "');";
                var sql = "INSERT INTO monitor_data (id, timestamp, user_id, device_id, sensor_id, sensor_value) VALUES (null, ?, ?, ?, ?, ?);";
                dbHelper.query(sql, [timestamp, user_id, device_id, sensor_id, sensor_value], function (result, error) {
                    writeSensorValue(i + 1);
                });
            }

            writeSensorValue(0)
        } else {
            console.log("no sensors");
        }
    };

    //this will update "fcm_user" with latest push token
    updatePushToken(id, msisdn, token, platform, callback) {
        console.log("MonitorApi: updatePushToken");

        let dbHelper = new DBHelper();
        var last_modified = moment().unix();

        var sql = "INSERT INTO fcm_user (id, msisdn, token, platform, last_modified) VALUES (?, ?, ?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE id = values(id), msisdn = values(msisdn), token = values(token), platform = values(platform), last_modified = values(last_modified);";
        dbHelper.query(sql, [id, msisdn, token, platform, last_modified], function (result, error) {
            if (callback) {
                if (result) {
                    console.log("MonitorApi: updatePushToken -> SUCCESS");
                    callback({status: "success"});
                } else {
                    console.log("MonitorApi: updatePushToken -> OK");
                    callback({status: "error"});
                }
            }
        });
    }

    //********************************************************************************************************************
    getUserToken(user_id, callback) {

        let dbHelper = new DBHelper();

        dbHelper.query("SELECT * FROM fcm_user WHERE id = ?", [user_id], (result, error) => {
            if (!error) {
                if (result && result.length > 0) {
                    if (callback) {
                        callback(null, result[0].token)
                    }
                } else {
                    if (callback) {
                        callback(ERR_CODE_NO_TOKEN_FOR_ORIGIN);
                    }
                }
            } else {
                if (callback) {
                    callback(ERR_CODE_DB_GET_TOKEN_FOR_ORIGIN);
                }
            }
        })
    };

    sendPushNotification() {
        console.log("MonitorApi: sendPushNotification");

        let msgTitle = "MONITOR INFO"
        let msgDescription = "ALARM: critical temperature !!!";
        let requestAction = config.action.critical_temp.toString();
        let user_id = "1001";

        this.getUserToken(user_id, (error, mobToken) => {
            if (!error) {
                if (mobToken && mobToken.length > 0) {
                    fcmHelper.pushMessage(mobToken, msgTitle, msgDescription, requestAction);
                } else {
                    console.log("MonitorApi: Invalid mobToken for userID: " + user_id + ", token: " + mobToken);
                }

            } else {
                console.log("MonitorApi: analyzeSensorsData.getUserToken ERROR -> " + JSON.stringify(error))
            }
        });
    }

    //********************************************************************************************************************
    /*
    analyzeSensorsData(user_id, device_id, sensor_id, sensor_value){
      console.log("MonitorApi: analyzeSensorsData -> sensor_id: " + sensor_id + ", sensor_value: " + sensor_value);

      user_id = "DY001";
      this.testSensorAlarm(user_id, device_id, sensor_id, sensor_value, (result) => {
        if (result){
          if (result.status == "ALARM"){
            console.log("MonitorApi: analyzeSensorsData.testSensorAlarm result.status -> ALARM");

            let msgTitle = "MONITOR INFO"
            let msgDescription = result.msgDescription;
            let msgData = result.msgData;

            this.getUserToken(user_id, (error, mobToken) => {
              if (!error) {
                if (mobToken && mobToken.length > 0){
                  fcmHelper.pushMessage(mobToken, msgTitle, msgDescription, msgData);
                }else{
                  console.log("MonitorApi: Invalid mobToken for userID: " + user_id + ", token: " + mobToken);
                }

              } else {
                console.log("MonitorApi: analyzeSensorsData.getUserToken ERROR -> " + JSON.stringify(error))
              }
            });
          }else{
            console.log("MonitorApi: analyzeSensorsData.testSensorAlarm result.status -> " + result.status);
          }
        }else{
          console.log("MonitorApi: analyzeSensorsData.testSensorAlarm -> result is NULL!");
        }

      });
    }*/


    //********************************************************************************************************************
    analyzeSensorsData(user_id, device_id, sensor_id, sensor_value, callback) {

        if (sensor_value) {
            let sVALUE = parseInt(sensor_value);

            this.getParamsForSensorID(sensor_id, (sensorParams) => {
                //console.log("MonitorApi: getParamsForSensorID -> " + JSON.stringify(sensorParams));

                let sName = "-";
                let sID = 0;
                var sMin = 0;
                var sMax = 0;

                var result = {
                    status: "OK",
                    msgData: {
                        sensor_id: sensor_id,
                        sensor_value: sensor_value,
                        sensor_alarm_min: "",
                        sensor_alarm_max: ""
                    }
                }

                if (sensorParams != null) {
                    //console.log("MonitorApi: getParamsForSensorID -> result: " + JSON.stringify(sensorParams));
                    sName = sensorParams.sensor_name;
                    sMin = sensorParams.alarm_min;
                    sMax = sensorParams.alarm_max;
                }

                if (callback) {
                    //console.log("testSensorAlarm -> sensor_value: " + sVALUE + ", sMin: " + sMin + ", sMax: " + sMax);
                    if (sMin !== null && sMax !== null && sVALUE !== null) {
                        if (sVALUE > sMax || sVALUE < sMin) {
                            //console.log("testSensorAlarm -> status -> ALARM");
                            result.status = "ALARM";
                            //result.msgDescription = "critical: " + sName + " temp. -> " + sVALUE;
                            result.msgData.sensor_alarm_min = sMin.toString();
                            result.msgData.sensor_alarm_max = sMax.toString();
                            result.msgData.sensor_value = sVALUE.toString();
                            callback(result);

                        } else {
                            //console.log("testSensorAlarm -> status -> OK");
                            result.status = "OK";
                            callback(result);
                        }
                    } else {
                        console.log("testSensorAlarm -> [sMin: %s || sMax:%s || sensor_value:%s] -> is NULL!", sMin, sMax, sVALUE);
                        result.status = "UNAVAILABLE";
                        callback(result);
                    }

                } else {
                    console.log("testSensorAlarm -> callback is NULL!");
                }
            });
        } else {
            if (callback) {
                console.log("testSensorAlarm -> invalid sensor value!");
                result.status = "ERROR";
                callback(result);
            }
        }
    }
}

module.exports = MonitorApi;
