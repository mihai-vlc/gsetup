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

// css packages
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var gulpFilter = require('gulp-filter');

var open = require('open');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var port = 8001; // webserver port

// folders to seach for partials template files
var tplPaths = [__dirname + '/src/partials'];


// build the html
gulp.task('html', function() {
  return gulp
          .src(['src/*.html', '!src/_*.html'])
          .pipe(data(function (file) {
            return {
              file: file.path
            };
          }))
          .pipe(template({
            pkg: require('./package.json'),
            include: include
          }))
          .on('error', function(e){
              log(e.message);
              this.emit('end');
          })
          .pipe(gulp.dest('dist/'));
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


// start a development server
gulp.task('serve', function () {
  connect.server({
    port: port,
    livereload: true
  });
  return true;
});

// minify the javascript
gulp.task('usemin', ['html'], function () {
  return gulp.src('dist/**/*.html')
          .pipe(usemin())
            .on('error', function(e){
                log(e.message);
                this.emit('end');
            })
          .pipe(gulp.dest('dist'))
          .pipe(connect.reload());
});

gulp.task('dev', ['sass', 'usemin', 'serve'], function () {

  gulp.watch('src/assets/scss/**/*.{sass,scss}', ['sass']);
  gulp.watch('src/**/*.{html,js}', ['usemin']);

  open('http://localhost:'+ port +'/dist');

});

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
