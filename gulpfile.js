/**
 * Gulp setup for web development
 * @author Mihai Ionut Vilcu <ionutvmi@gmail.com>
 * Dec 2014
 */
/* globals require, __dirname*/
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var template = require('gulp-template');
var data = require('gulp-data');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

// css packages
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var gulpFilter = require('gulp-filter');
var minifyCSS = require('gulp-minify-css')

var open = require('open');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var port = 8001; // webserver port

// folders to seach for partials template files
var tplPaths = [__dirname + '/src/partials'];


// build the html
gulp.task('html', function() {
  var isBuild = (this.seq.indexOf('usemin') > -1);

  return gulp
          .src(['src/*.html', '!src/_*.html'])
          // attach the path of the file
          .pipe(data(function (file) {
            return {
              file: file.path
            };
          }))
          // compile the template
          .pipe(template({
            isBuild: function () {
              return isBuild;
            },
            pkg: require('./package.json'),
            include: include,
            path: path
          }))
          .on('error', function(e){
              log(e.message);
              this.emit('end');
          })
          .pipe(gulp.dest('dist/'))
          .pipe(connect.reload());
});

// compile sass
gulp.task('sass', function () {
    var cssFilter = gulpFilter('**/*.css');
    return gulp.src(['src/assets/scss/**/*.{scss,sass}'])
            .pipe(sass({style : 'expanded'}))
                .on('error', function(e){
                    log(e.message);
                    this.emit('end');
                })
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(autoprefixer({
                browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'Opera 12.1', 'IE 8']
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/assets/css'))
            .pipe(cssFilter)
            .pipe(connect.reload());
});

gulp.task('sass:build', ['sass'], function () {
  return gulp.src(['dist/assets/css/*.css', '!dist/assets/css/*.min.css'])
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/assets/css'));
});

// start a development server
gulp.task('serve', function () {
  connect.server({
    port: port,
    livereload: true
  });
  return true;
});

// concatenate & minify the javascript
gulp.task('usemin', ['html', 'sass:build'], function () {

  var uglify_log = uglify().on('error', function(e){
    log(e.message);
    this.emit('end');
  });

  return gulp.src('dist/**/*.html')
          .pipe(usemin({
            js: [uglify_log]
          }))
          .on('error', function(e){
              log(e.message);
              this.emit('end');
          })
          .pipe(gulp.dest('dist'));
});


// copy the files that we don't compile
gulp.task('copy', ['clean:files'], function () {
  return gulp.src(['src/**/*.*', '!src/**/*.html', '!src/**/*.js', '!src/**/*.{sass,scss}'])
    .pipe(gulp.dest('dist/'));
});


// clean tasks
gulp.task('clean:files', function (cb) {

  del([
    'dist/**/*.*',
    '!dist/**/*.html',
    '!dist/**/*.js',
    '!dist/**/*.{css,map}'
  ], cb);

});

gulp.task('clean:js', function (cb) {

  del([
    'dist/**/*.js'
  ], cb);

});

gulp.task('clean:html', function (cb) {

  del([
    'dist/**/*.html'
  ], cb);

});

gulp.task('clean:css', function (cb) {

  del([
    'dist/**/*.css',
    'dist/**/*.css.map'
  ], cb);

});

gulp.task('clean', function (cb) {
  del(['dist'], cb);
});


gulp.task('dev', ['sass', 'copy', 'html', 'serve'], function () {

  gulp.watch('src/assets/scss/**/*.{sass,scss}', ['sass']);

  gulp.watch('src/**/*.html', ['html']);

  gulp.watch('src/**/*.js', function () {
    gulp.src('src/**/*.js').pipe(connect.reload());
  });

  open('http://localhost:'+ port +'/dist');

});

gulp.task('build', ['copy', 'usemin']);



/**
 * Lo-Dash Template helpers
 */

function include(tplName) {
  /* jshint validthis: true*/
  var content = '', filePath;
  var t = this;

  if (typeof tplName != 'string') {
    log('>> The tplName must be a string: ' + tplName);
    return '';
  }

  // add the file dir to the paths
  tplPaths.push(path.dirname(t.file));


  // grab the path
  filePath = getFilePath(tplName);

  if ( ! filePath) {
    log('>> The import file does not exists: ' + tplName);
    return '';
  }

  if (filePath == t.file) {
    log('>> You can not import a file into itself !');
    return '';
  }
  // if ( t._recursion && !validReference(t, t.file) ) {
  //   log('>> Recursion detected !', t.file);
  //   return '';
  // }

  try {
    var data = Object.create(t);
    data.file = filePath;
    data._recursion = true;

    content = _.template(fs.readFileSync(filePath), data);
  } catch(e) {
    log('>> ' + e.message);
  }

  return content;
}

/**
 * Builds and returns the path based on the template name
 * @param  {string} tplName The name/path to the template
 * @return {string|boolean}         The path or false if the path doesn't exists
 */
function getFilePath(tplName) {
  var filePath, basePath, name, dir;


  for (var i = 0, l = tplPaths.length; i < l; i++) {
    basePath = tplPaths[i];

    // check for the short name
    // ex: partials/test
    name = path.basename(tplName);
    dir = basePath + '/' + path.dirname(tplName);
    filePath = path.normalize(dir + '/_' + name + '.html');

    if (fs.existsSync(filePath)) {
      return filePath;
    }

    // check for the full name
    // ex: partials/test.html
    filePath = path.normalize(basePath + '/' + tplName);

    if (fs.existsSync(filePath)) {
      return filePath;
    }

  }

  // the file was not found
  return false;
}



function log(msg) {
  gutil.log('\x07 [Error] ' + msg);
}
