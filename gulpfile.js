var gulp = require('gulp');
var gutil = require('gulp-util');
var child_process = require('child_process')
var path = require('path')

var execSync = require('child_process').execSync

//---------------------------------------------------

var configLive = require('config.json')('./config/live.json');
var configDevelop = require('config.json')('./config/develop.json');



function exec(format, params) {
  execSync(require('util').format.apply(null, arguments))
}


function deployLive(server_user, server_ip) {
  console.log("------------------------------------------------------------");
  console.log('deploy LIVE (v%s) to server: %s', configLive.service.version, server_ip);
  console.log("stopping MonitorApp....");
  try {
    exec('ssh %s@%s "pm2 delete --silent MonitorApp"', server_user, server_ip);
  } catch(e){
    console.log("MonitorApp not running or some error:", e);
  };

  console.log("transfer source....");
  exec('scp package.json %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp MonitorApp.js %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r config %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r src %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r resources %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r views %s@%s:./MonitorService/', server_user, server_ip);


  console.log("starting MonitorApp....");
  let logTS = "--log-date-format \'YYYY-MM-DD HH:mm:ss\'";
  //console.log("CMD: " + "ssh %s@%s \"cd %s; pm2 start MonitorApp.js %s\"", configLive.server.user, configLive.server.ip, configLive.service.path, logTS );
  exec("ssh %s@%s \"cd %s; pm2 start MonitorApp.js %s\"", configLive.server.user, configLive.server.ip, configLive.service.path, logTS);
  //exec("ssh %s@%s \'pm2 start %s/MonitorApp.js --watch --log-date-format \'YYYY-MM-DD HH:mm:ss\'\'", server_user, server_ip, configLive.service.path);      //connect to server
  //exec('ls -al');
  //exec('cd ~/home/duby/MonitorService');
  //try { exec('pm2 delete MonitorApp"'); } catch(e) {}
  //exec('pm2 stop all');
  //exec('pm2 start MonitorApp.js');

  //

  console.log("------------------------------------------------------------");
}

function deployDevelop() {
  console.log("------------------------------------------------------------");
  console.log('deploy DEVELOP - (locally)');
  //exec('pm2 delete MonitorApp');
  exec('pm2 stop all');
  exec('pm2 start MonitorApp.js -f -i 1');
  //exec('pm2 start MonitorApp.js --log-date-format \"YYYY-MM-DD HH:mm:ss\"');

  console.log("------------------------------------------------------------");
}

function restartMonitorApp() {
  var status = "SUCCESS";
  try {
    exec('ssh %s@%s "pm2 delete --silent MonitorApp"', configLive.server.user, configLive.server.ip);
  } catch(e){
    //console.log("error:", e);
    status = "FAILED";
  };
  try {
    //exec("ssh %s@%s 'cd %s; pm2 start MonitorApp.js'", configLive.server.user, configLive.server.ip, configLive.service.path);
    let logTS = "--log-date-format \'YYYY-MM-DD HH:mm:ss\'";
    exec("ssh %s@%s \"cd %s; pm2 start MonitorApp.js %s\"", configLive.server.user, configLive.server.ip, configLive.service.path, logTS);
  } catch(e){
    //console.log("error:", e);
    status = "FAILED";
  };
  return status;
}

//gulp tasks
//--------------------------------------------------------------------------
gulp.task('restart MonitorApp', function() {
  var status = restartMonitorApp();
  return gutil.log('restarting MonitorApp service: ', status)
});

//gulp.task('default', function() {
//  return gutil.log('Gulp is running!')
//});

// copy files locally
//gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
//  gulp.src('source/*.html').pipe(gulp.dest('public'));
//});


//--------------------------------------------------------------------------
gulp.task('live', [], function (done) {
  deployLive(configLive.server.user, configLive.server.ip);
  done()
})

gulp.task('develop', [], function (done) {
  deployDevelop();

  done()
})



