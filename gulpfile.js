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
  console.log('deploy LIVE to server: ', server_ip);
  console.log("stopping MonitorApp....");
  try { exec('ssh %s@%s "pm2 delete MonitorApp"', server_user, server_ip);} catch(e){};      //connect to server

  console.log("transfer source....");
  exec('scp package.json %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp MonitorApp.js %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r config %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r src %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r resources %s@%s:./MonitorService/', server_user, server_ip);
  exec('scp -r views %s@%s:./MonitorService/', server_user, server_ip);
  //exec('cp -R config/live.json config/live.json');
  //exec('cp -a src src');


  console.log("starting MonitorApp....");
  //exec("ssh %s@%s \'pm2 start %s/MonitorApp.js --watch --log-date-format \'YYYY-MM-DD HH:mm:ss\'\'", server_user, server_ip, configLive.service.path);      //connect to server
  exec("ssh %s@%s \'pm2 start %s/MonitorApp.js\'", server_user, server_ip, configLive.service.path);
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

//gulp tasks
//--------------------------------------------------------------------------
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

gulp.task('copyNotes', function() {
  gulp.src('notes.txt').pipe(gulp.dest('.'));
});

gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
  gulp.src('source/*.html').pipe(gulp.dest('public'));
});


//--------------------------------------------------------------------------
gulp.task('live', [], function (done) {
  var server_user = configLive.server.user;
  var server_ip = configLive.server.ip;
  deployLive(server_user, server_ip);

  done()
})

gulp.task('develop', [], function (done) {
  deployDevelop();

  done()
})



