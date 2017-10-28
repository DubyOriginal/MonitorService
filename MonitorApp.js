/*

 INSTALLATION:
 1. npm init    //package.json vizard
 2. npm install express --save
 3. npm install request --save
 4. npm install mysql --save
 5.a create nodemon.json file
 5.b npm install nodemon --save   // automatically restart the server after each change
 5.c nodemon app.js               //start server
 6. npm install moment --save
 7. npm install ejs --save
 8. npm install path --save
 8. npm install bower --save


 */

class MonitorApp {

  constructor(app) {
    console.log("MonitorApp initialized");
    //this.monitor_router = new MonitorRouter()
  }
}

var logStartingInfo = function() {
  console.log("------------------------------------------------------------");
  console.log("starting MonitorService...");
}


logStartingInfo();
new MonitorApp();
require('./src/MonitorRouter');



