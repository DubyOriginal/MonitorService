var gulp = require('gulp');
var gutil = require('gulp-util');
var child_process = require('child_process');
var path = require('path');
var process = require('process');

var execSync = require('child_process').execSync

//---------------------------------------------------
var Config = require('./config/Config.js');

function exec(format, params) {
    execSync(require('util').format.apply(null, arguments))
}


function deployLive(server_user, server_ip) {
    console.log("------------------------------------------------------------");
    console.log('deploy (%s) v%s to server -> %s:%s', config.service.mode, config.service.version, server_ip, config.service.port);
    //console.log("######### : " + JSON.stringify(config));
    console.log("stopping MonitorApp....");
    try {
        exec('ssh %s@%s "pm2 delete MonitorApp --silent"', server_user, server_ip);
    } catch (e) {
        console.log("err: Unable to stop MonitorApp OR already stopped!");
    }

    console.log("transfer source....");
    exec('scp package.json %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp bower.json %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp MonitorApp.js %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp -r config %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp -r src %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp -r resources %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp -r views %s@%s:./MonitorService/', server_user, server_ip);
    exec('scp -r private %s@%s:./MonitorService/', server_user, server_ip);


    console.log("starting MonitorApp....");
    let addServiceName = "MonitorApp";
    let addLogTS = "--log-date-format \'YYYY-MM-DD HH:mm:ss\'";
    let addPSNumber = "-i 2";
    //console.log("CMD: " + "ssh %s@%s \"cd %s; pm2 start MonitorApp.js %s %s\"", config.server.user, config.server.ip, config.service.path, addLogTS, addPSNumber );
    exec("ssh %s@%s \"cd %s; NODE_ENV=LIVE pm2 start MonitorApp.js --name %s %s %s\"", config.server.user, config.server.ip, config.service.path, addServiceName, addLogTS, addPSNumber);

    console.log("------------------------------------------------------------");
}

function deployDevelop() {
    console.log("------------------------------------------------------------");
    console.log('deploy DEVELOP - (locally)');
    try {
        exec('pm2 delete MonitorApp --silent');
    } catch (e) {
    }
    exec('NODE_ENV=DEVELOP pm2 start MonitorApp.js');
    //exec('pm2 start MonitorApp.js --log-date-format \"YYYY-MM-DD HH:mm:ss\"');

    console.log("------------------------------------------------------------");
}

function restartMonitorApp() {
    var status = "SUCCESS";
    try {
        exec('ssh %s@%s "pm2 delete --silent MonitorApp"', config.server.user, config.server.ip);
    } catch (e) {
        //console.log("error:", e);
        status = "FAILED";
    }
    ;
    try {
        //exec("ssh %s@%s 'cd %s; pm2 start MonitorApp.js'", config.server.user, config.server.ip, config.service.path);
        let addLogTS = "--log-date-format \'YYYY-MM-DD HH:mm:ss\'";
        exec("ssh %s@%s \"cd %s; pm2 start MonitorApp.js %s\"", config.server.user, config.server.ip, config.service.path, addLogTS);
    } catch (e) {
        //console.log("error:", e);
        status = "FAILED";
    }
    ;
    return status;
}

//gulp tasks
//--------------------------------------------------------------------------
gulp.task('restart MonitorApp', function () {
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
gulp.task('live_pm2', [], function (done) {
    var env = Object.create(process.env);
    process.env.NODE_ENV = 'LIVE';
    config = new Config();
    deployLive(config.server.user, config.server.ip);
    done()
});

gulp.task('stop_monitor_develop', [], function (done) {
    try {
        exec('pm2 delete MonitorApp --silent');
    } catch (e) {
    }
    done()
});

gulp.task('develop_pm2', [], function (done) {
    process.env.NODE_ENV = 'DEVELOP';
    config = new Config();
    deployDevelop();
    done()
});

/*
gulp.task('develop_node', function() {
  var env = Object.create(process.env);
  process.env.NODE_ENV = 'DEVELOP';
  config = new Config();

  try {exec('pm2 delete MonitorApp --silent');} catch (e) {}
  try {exec('killall node');} catch (e) {}

  var spawn = require('child_process').spawn;
  spawn('node', ['MonitorApp.js'], { stdio: 'inherit', env: env});
});
*/






