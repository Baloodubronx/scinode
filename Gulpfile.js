// npm install --save-dev gulp main-bower-files gulp-inject gulp-livereload gulp-watch gulp-nodemon streamqueue gulp-uglify gulp-concat gulp-ng-annotate gulp-rev gulp-rimraf run-sequence gulp-filter gulp-minify-css

var gulp = require('gulp'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    streamqueue = require('streamqueue'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    templateCache = require('gulp-angular-templatecache');


function jsfiles() {
  return streamqueue({ objectMode: true },
            gulp.src(bowerFiles(), {read: false}).pipe(gulpFilter(['*.js', '!bootstrap-sass-official', '!bootstrap.js', '!json3', '!es5-shim'])),
            gulp.src(['./client/+(app|components|services|partials|directives)/**/*.js'], {read: false})
        );
}

function cssfiles() {
  return streamqueue({ objectMode: true },
      gulp.src(bowerFiles(), {read: false}).pipe(gulpFilter(['*.css', '!bootstrap-sass-official', '!bootstrap.css', '!json3', '!es5-shim'])),
      gulp.src(['./client/+(app|components|services|partials|directives)/**/*.css'], {read:false})

    );
}

gulp.task('jade', function() {
  return gulp.src('./client/**/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./temp/'));
});

gulp.task('templates', ['jade'], function () {
  return gulp.src('./temp/**/*.html')
    .pipe(templateCache({module:'scinodeApp'}))
    .pipe(gulp.dest('./client/app'))
    .pipe(livereload());
});

gulp.task('stylus', function(){
  return gulp.src('./client/**/*.styl')
    .pipe(stylus())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./client/app'))
    .pipe(livereload());
});

gulp.task('inject', ['stylus', 'templates'], function(){
  gulp.src('./client/index.html')
    .pipe(inject(jsfiles(), {relative:true}))
    .pipe(inject(cssfiles(), {relative:true}))
    .pipe(gulp.dest('./client/'));
});

gulp.task('reload', function(){
  gulp.src('./client/*/*.js').pipe(livereload());
});

gulp.task('watch', ['inject'], function() {
  // start the livereload server
  livereload.listen();

  gulp.watch('./client/**/*.styl', ['stylus']);
  gulp.watch('./client/**/*.jade', ['templates']);
  gulp.watch('./client/**/*.js', ['reload']);
});

gulp.task('serve', ['watch'], function(){

  nodemon(
    { script: 'server/app.js',
    watch: ['server/**/*.js'],
      env: { 'PORT':3000 } })
    .on('restart', function () {
      setTimeout(function() {livereload.changed();}, 1000);
      console.log('restarted!');
    });
});


/*
  Now for the distribution part:
*/

var uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    rev = require('gulp-rev'),
    rimraf = require('gulp-rimraf'),
    runSequence = require('run-sequence'),
    gulpFilter = require('gulp-filter'),
    minifyCSS = require('gulp-minify-css');


gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['templates', 'stylus'],
    ['build-scripts', 'build-scripts-bower', 'build-styles', 'build-styles-bower'],
    ['copy-server', 'copy-assets', 'copy-client'],
    'build-html',
    callback);
});


gulp.task('clean', function(){
  return gulp.src('./dist/**/*.*', {read:false})
    .pipe(rimraf());
});

gulp.task('build-scripts', function() {
  return gulp.src(['./client/app/**/*.js', './client/components/**/*.js', './client/services/**/*.js', './client/directives/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./dist/public/app'));
});

gulp.task('build-scripts-bower', function() {
  return gulp.src(bowerFiles())
    .pipe(gulpFilter(['*.js', '!bootstrap-sass-official', '!bootstrap.js', '!json3', '!es5-shim']))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./dist/public/app'));
});

gulp.task('build-styles',function() {
  return gulp.src(['./client/app/**/*.css', './client/components/**/*.css', './client/services/**/*.css', './client/directives/**/*.css'])
    .pipe(concat('app.css'))
    .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('./dist/public/app'));
});

gulp.task('build-styles-bower', function() {
  return gulp.src(bowerFiles())
    .pipe(gulpFilter(['*.css', '!bootstrap-sass-official', '!json3',  '!es5-shim']))
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('./dist/public/app'));
});

gulp.task('copy-server', function(){
  return gulp.src('./server/**/*.*')
    .pipe(gulp.dest('./dist/server'));
});

gulp.task('copy-assets', function() {
  return gulp.src('./client/assets/**/*.*')
    .pipe(gulp.dest('./dist/public/assets'));
});

gulp.task('copy-client', function(){
  return gulp.src('./client/**/**/*.+(html|txt|ico)')
    .pipe(gulp.dest('./dist/public/'));
});

function buildjs() {
  return streamqueue({ objectMode: true },
      gulp.src('app/vendor*.js', {read:false, 'cwd': __dirname + '/dist/public/'}),
      gulp.src('app/app*.js', {read:false, 'cwd': __dirname + '/dist/public/'})
    );
}

function buildcss() {
  return streamqueue({ objectMode: true },
      gulp.src('app/vendor*.css', {read:false, 'cwd': __dirname + '/dist/public/'}),
      gulp.src('app/app*.css', {read:false, 'cwd': __dirname + '/dist/public/'})
    );
}

gulp.task('build-html', function() {
  return gulp.src('./client/index.html')
    .pipe(inject(buildjs(), {relative:false}))
    .pipe(inject(buildcss(), {relative:false}))
    .pipe(gulp.dest('./dist/public'));
});
