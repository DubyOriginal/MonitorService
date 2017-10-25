var gulp = require('gulp')
require('gulp-run-seq')
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat-util')
var child_process = require('child_process')
var path = require('path')
var sass = require('gulp-sass')
var zip = require('gulp-zip')
var execSync = require('child_process').execSync

var execDelay = 0

process.stdout.setMaxListeners(100)
process.stderr.setMaxListeners(100)

function exec(format, params) {
  execSync(require('util').format.apply(null, arguments))
}

gulp.task('compile-sass', function () {
  return gulp.src('resources/web/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/resources/web/css'))
})

gulp.task('compile-common', ['compile-sass'], function (done) {

  exec('cp -a views dist/')
  exec('cp -a resources dist/')
  exec('mkdir -p dist/wsdl')
  exec('mkdir -p dist/logs')
  exec('cp -a wsdl/dev/* dist/wsdl')
  exec('cp -a config/config.dev.json dist/config.json')
  exec('cp -a package.json dist/')
  exec('cp -a README.md dist/')
  exec('cp -a LICENSE.md dist/')
  exec('cp -a sitemap.xml dist/')


  done()
})

gulp.task('compile-web', ['compile-common'], function (done) {
  return gulp.src([
    'src/lib/**/*.js',
    'src/web/**/*.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({stage: 0, optional: ['runtime']}))
    .on('error', function (e) {
      console.log('>>> ERROR\n', e.name, ':', e.message)
      this.emit('end')
    })
    .pipe(concat('web.js'))
    .pipe(concat.header("require('source-map-support').install();\n"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .on('end', function () {
      done()
    })
})

gulp.task('compile', [['compile-web']])

var task_web

gulp.task('restart-web', ['compile-web'], function (done) {
  if (task_web) {
    task_web.stdout.unpipe()
    task_web.stderr.unpipe()
    task_web.kill('SIGKILL')
  }

  setTimeout(function () {
    task_web = child_process.spawn('node', [path.join(__dirname, 'dist/web.js')])
    task_web.stdout.pipe(process.stdout)
    task_web.stderr.pipe(process.stdout)

    done()
  }, execDelay)
})

gulp.task('develop-restart', ['restart-web'])


function deploy(server, target) {
  console.log('deploy', target, 'to', server)

  console.log('  - stopping services')
  try {
    exec('ssh -i deploy.key services@%s "pm2 delete %s-web"', server, target);
  } catch (e) {
  }

  console.log('  - transfering files')
  exec('rsync -avz --exclude "resources/upload/*" --exclude "resources/web/upload/*" -e "ssh -i deploy.key" dist/* services@%s:%s/', server, target)

  console.log('  - installing npm modules')
  exec('ssh -i deploy.key services@%s "cd %s; npm install" ', server, target)

  console.log('  - starting services')
  exec('ssh -i deploy.key services@%s "cd %s; pm2 start web.js -f -n %s-web -i 3"', server, target, target)
}

gulp.task('test', [], function (done) { // 'compile'

  exec('rm -rf dist/wsdl')
  exec('mkdir -p dist/wsdl')
  exec('cp -a wsdl/prelive/* dist/wsdl/')
  exec('cp config/config.test.json dist/config.json')

  var server = '192.168.1.26';
  deploy(server, 'live');

  done()
})

gulp.task('live', [], function (done) { // 'compile'
  exec('rm -rf dist/wsdl')
  exec('mkdir -p dist/wsdl')
  exec('cp -a wsdl/live/* dist/wsdl/')
  exec('cp config/config.live.json dist/config.json')

  var server = '192.168.1.26';
  deploy(server, 'live');

  done()
})

gulp.task('develop', [['develop-restart', 'develop-watch']])
