/**
 * Created by dvrbancic on 16/09/2017.
 */
const MonitorApi = require('./MonitorApi');
const path = require('path');
const express = require('express');
const request = require('request');

const bodyParser = require('body-parser');
var monitorApi;


var app = express();

class MonitorRouter {
  constructor() {
    console.log("MonitorRouter initialized");
    monitorApi = new MonitorApi();
  }
}

new MonitorRouter();

const APP_PORT = 2200;

//**********************************************************************************************************************
// EXPRESS CONFIGURATION
//**********************************************************************************************************************
let viewPath = __dirname + '/../views';
let resPath = __dirname + '/../resources';
let bowerPath = __dirname + '/../bower_components';
app.use(express.static(viewPath));
app.use(express.static(resPath));
app.use(express.static(bowerPath));

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// view engine setup
app.set('view engine', 'ejs');

//**********************************************************************************************************************
// FRONT ROUTES - PAGE
//**********************************************************************************************************************
app.get('/', function (req, res) {
  console.log("server: /ROOT");
  res.render('./pages/index')
});

// monitoring sensors data
app.get('/datatable', function (req, res) {

  res.render('./pages/datatable');

  /*
  monitorApi.getAllSensorsData(function (allSensorData) {
    res.render('./pages/datatable', {
      allSensorData: allSensorData
    });
  });
  */
});

// monitoring sensors data
app.get('/monitoring', function (req, res) {

  monitorApi.getAllSensorsData(function (allSensorData) {
    res.render('./pages/monitoring', {
      allSensorData: allSensorData
    });
  });
});

// monitoring sensors data
app.get('/basement', function (req, res) {

  monitorApi.getAllSensorsData(function (allSensorData) {
    res.render('./pages/basement2', {
      allSensorData: allSensorData
    });
  });
});

// monitoring sensors data
app.get('/house', function (req, res) {

  monitorApi.getAllSensorsData(function (allSensorData) {
    res.render('./pages/house', {
      allSensorData: allSensorData
    });
  });
});

//monitoring single sensor
app.get('/sensortest', function (req, res) {
  res.render('./pages/sensortest');
});

//device manager
app.get('/devicemanager', function (req, res) {
  res.render('./pages/devicemanager');
});

//**********************************************************************************************************************
// PUBLIC ROUTES
app.use('/test', function (req, res, next) {
  console.log("server: /test");
});

// get values from DB
app.get('/getallsensorsdata', function (req, res) {
  console.log("server: GET /getallsensorsdata");
  monitorApi.getAllSensorsData((result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/getallsensorsdata res in NULL");
    }
  });
});

//http://localhost:2200/getsensordata/101
app.get('/getsensordata/:sensor_id', function (req, res) {
  let sensor_id = req.params.sensor_id;
  console.log("server: GET /getallsensorsdata/" + sensor_id);

  res.set('Content-Type', 'application/json')
  res.send("RECEIVED /getsensordata/" + sensor_id);
  monitorApi.getSensorData(sensor_id);
});

//http://localhost:2200/getlatestsensormeasurement/101
app.get('/getlatestsensormeasurement/:sensor_id', function (req, res) {
  let sensor_id = req.params.sensor_id;
  console.log("server: GET /getlatestsensormeasurement/" + sensor_id);

  monitorApi.getLatestSensorValue(sensor_id, (result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/getlatestsensormeasurement/ res in NULL");
    }
  });
});

//http://localhost:2200/getsensorbyscreenid/10
app.get('/getsensorbyscreenid/:screen_id', function (req, res) {
  let screen_id = req.params.screen_id;
  console.log("server: GET /getsensorbyscreenid/" + screen_id);

  monitorApi.getSensorByScreenID(screen_id, (result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/getsensorbyscreenid/ res in NULL");
    }
  });
});

//http://localhost:2200/getallsensorparams
app.get('/getallsensorparams', function (req, res) {
  console.log("server: GET /getallsensorparams");

  monitorApi.getAllSensorParams((result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/getallsensorparams res in NULL");
    }
  });
});

//http://localhost:2200/getbasementsensordata
app.get('/getbasementsensordata', function (req, res) {
  console.log("server: GET /getbasementsensordata");

  monitorApi.getBasementSensorData((result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/getbasementsensordata res in NULL");
    }
  });
});

//http://localhost:2200/updatesensorparams  {sensor_params}
app.post('/updatesensorparams', function (req, res) {
  console.log("server: POST /updatesensorparams");

  let sensor = {
    id : req.body.id,
    sensor_type : req.body.sensor_type,
    sensor_mid : req.body.sensor_mid,
    sensor_address : req.body.sensor_address,
    sensor_name : req.body.sensor_name,
    alarm_min : req.body.alarm_min,
    alarm_max : req.body.alarm_max,

  };
  monitorApi.updateSensorParams(sensor, (result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/updatesensorparams res in NULL");
    }
  });
});

//http://localhost:2200/getuseridsensordata/DY001
app.get('/getuseridsensordata/:user_id', function (req, res) {
  let user_id = req.params.user_id;
  console.log("server: GET /getuseridsensordata/" + user_id);

  res.set('Content-Type', 'application/json')
  res.send("RECEIVED /getuseridsensordata/" + user_id);
  monitorApi.getUserData(user_id);
});


//http://localhost:2200/getallsensorparams
app.get('/savescreensensor/:screen_id/:sensor_id', function (req, res) {
  let screen_id = req.params.screen_id;
  let sensor_id = req.params.sensor_id;
  console.log("server: GET /savescreensensor/" + screen_id + "/" + sensor_id);

  monitorApi.saveScreenSensor(screen_id, sensor_id, (result) => {
    if (res != null){
      if (result != null){
        res.set('Content-Type', 'application/json')
        res.send(result);
      }else{
        res.send(null);
      }
    }else{
      console.log("/savescreensensor res in NULL");
    }
  });
});

//**********************************************************************************************************************
// CLIENT ROUTES - (from DEVICE)
//**********************************************************************************************************************
// Store values to DB -> addValues(user_id, device_id, sensor_type, sensor_value){
app.post('/storedevicedata', function (req, res) {
  /*{
   "sensors":[{"sensor_id":"101","sensor_value":"11.33"},{"sensor_id":"102","sensor_type":"hum","sensor_value":"22.33"}],
   "user_id":"DY001",
   "device_id":"123456"}
   */
  const data = req.body;
  const user_id = data.user_id;
  const device_id = data.device_id;
  const sensors = data.sensors;

  res.set('Content-Type', 'application/json');
  res.send("RECEIVED POST {user_id: " + JSON.stringify(user_id) + ", device_id: " + JSON.stringify(device_id) + ", sensors: " + JSON.stringify(sensors) + "}");

  console.log("server: POST /storedevicedata");
  //console.log("RECEIVED POST {user_id: " + JSON.stringify(user_id) + ", device_id: " + JSON.stringify(device_id) + ", sensors: " + JSON.stringify(sensors) + "}");

  if (user_id != null && device_id != null && sensors != null) {
    monitorApi.storeDeviceData(user_id, device_id, sensors);
  } else {
    console.warn("Received invalid values!")
  }
});

//device is ready to receive some control commands or adjustment
app.get('/requestcommand', function (req, res) {
  console.log("server: GET /requestcommand");
  var response = {
    status: "ok",
    command : "CMD_LED_ON"
  }
  res.set('Content-Type', 'application/json')
  res.send(JSON.stringify(response));
});

//**********************************************************************************************************************
app.listen(APP_PORT, function (err) {
  if (err) {
    console.log("app.listen err -> " + err)
    throw err;
  }
  console.log('Server started on PORT: ' + APP_PORT.toString())
}).on('error', function (err) {
  if (err) {
    console.warn("app.on.error -> " + err)
  }
});

