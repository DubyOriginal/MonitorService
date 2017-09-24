/*

 INSTALLATION:
 1. npm init    //package.json vizard
 2. npm install express --save
 3. npm install request --save
 4. npm install pug --save
 5. npm install mysql --save
 6.a create nodemon.json file
 6.b npm install nodemon --save   // automatically restart the server after each change
 6.c nodemon app.js               //start server
 7. npm install moment --save

 */

require('./MonitorRouter');

class MonitorApp {

  constructor(app) {

    console.log("MonitorApp initialized");
    //this.monitor_router = new MonitorRouter()
  }
}

var mApp = new MonitorApp();