/**
 * Created by dvrbancic on 16/09/2017.
 */

var monitorApi;

class MonitorRouter {

  constructor() {
    console.log("MonitorRouter initialized");

    const MonitorApi = require('./MonitorApi.js');
    monitorApi = new MonitorApi();
  }

  /*
  'POST /api/test'(req, res) {gitt
    console.log("MonitorAppRouter /api/test");
    this.monitor_api.test(req, r
  }*/

}

var monitor_router = new MonitorRouter();

var express = require('express');
var request = require('request');

const bodyParser = require('body-parser');
const APP_PORT = 2200;

// Fichiers publics (css, img) - Public files
var app = express();
var baseUrl = "http://192.168.1.57";    //measurement device IP

// Pages HTML créées directement à partir des temmplates Pug - Create HTML page directly form Pug templates
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

//**********************************************************************************************************************
// PRIVATE ROUTES
app.get('/', function(req, res) {
  console.log("server: /ROOT");
  res.render('index')
});

app.use('/mesures.json', function (req, res, next) {
  request({url: baseUrl + '/mesures.json',timeout:2000}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Data from: ESP8266" + body)
      res.send(body);
    } else {
      console.log("ESP8266 not available, demo values will be send");
      res.send({"t":"21.70","h":"29.50","pa":"984.43"});
    }
  })
});

//**********************************************************************************************************************
// PUBLIC ROUTES
app.use('/test', function (req, res, next) {
  console.log("server: /test");
});

//**********************************************************************************************************************
// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// get values from DB
app.get('/getallsensorsdata', function (req, res) {
  console.log("server: GET /getallsensorsdata");
  res.set('Content-Type', 'application/json')
  res.send("RECEIVED /getallsensorsdata");
  monitorApi.getAllSensorsData();
});

//http://localhost:2200/getsensordata/00%2000%2000%2000%2000%2011%2012%2013
app.get('/getsensordata/:sensor_id', function (req, res) {
  let sensor_id = req.params.sensor_id;
  console.log("server: GET /getallsensorsdata/" + sensor_id);

  res.set('Content-Type', 'application/json')
  res.send("RECEIVED /getsensordata/" + sensor_id);
  monitorApi.getSensorData(sensor_id);
});

//http://localhost:2200/getuseridsensordata/DY001
app.get('/getuseridsensordata/:user_id', function (req, res) {
  let user_id = req.params.user_id;
  console.log("server: GET /getuseridsensordata/" + user_id);

  res.set('Content-Type', 'application/json')
  res.send("RECEIVED /getuseridsensordata/" + user_id);
  monitorApi.getUserData(user_id);
});

// Store values to DB
//addValues(uid, sensor_type, sensor_value){
app.post('/storedevicedata', function (req, res) {
  /*{
  "sensors":[{"sensor_id":"3563547","sensor_type":"temp","sensor_value":"1234"},{"sensor_id":"3563547","sensor_type":"hum","sensor_value":"5678"}],
  "user_id":"DY001",
  "device_id":"123456"}
   */
  const data = req.body;
  const user_id = data.user_id;
  const device_id = data.device_id;
  const sensors = data.sensors;
  //const sensor_id = data.sensor_id;
  //const sensor_value = data.sensor_value;

  res.set('Content-Type', 'application/json');
  res.send("RECEIVED POST {user_id: " + JSON.stringify(user_id) + ", device_id: " + JSON.stringify(device_id) + ", sensors: " + JSON.stringify(sensors) + "}");

  console.log("server: POST /storedevicedata");
  console.log("RECEIVED POST {user_id: " + JSON.stringify(user_id) + ", device_id: " + JSON.stringify(device_id) + ", sensors: " + JSON.stringify(sensors) + "}");

  if (user_id != null && device_id != null && sensors != null){
    monitorApi.storeDeviceData(user_id, device_id, sensors);
  }else{
    console.warn("Received invalid values!")
  }


})

//**********************************************************************************************************************
app.listen(APP_PORT, function (err) {
  if (err) {
    console.log("app.listen err -> " + err)
    throw err;
  }
  console.log('Server started on PORT: ' + APP_PORT.toString())
}).on('error', function(err) {
  if (err) {
    console.warn("app.on.error -> " + err)
  }
});

