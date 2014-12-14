/**
 * Gulp setup for web development
 * @author Mihai Ionut Vilcu <ionutvmi@gmail.com>
 * Dec 2014
 */
/* globals require, console, __dirname*/
'use strict';

var gulp = require('gulp');
var template = require('gulp-template');
var data = require('gulp-data');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

// folders to seach for partials template files
var tplPaths = [__dirname + '/src/partials'];


gulp.task('default', function() {
  gulp
    .src(['src/*.html', '!src/_*.html'])
    .pipe(data(function (file) {
      return {
        file: file.path
      };
    }))
    .pipe(template({
      name: 'Mihai',
      include: include
    }))
    .pipe(gulp.dest('dist/'));
});


/**
 * Lo-Dash Template helpers
 */

function include(tplName) {
  /* jshint validthis: true*/
  var content = '', filePath;
  var t = this;

  if (typeof tplName != 'string') {
    console.log('\x07>> The tplName must be a string: ' + tplName);
    return '';
  }

  // add the file dir to the paths
  tplPaths.push(path.dirname(t.file));


  // grab the path
  filePath = getFilePath(tplName);

  if ( ! filePath) {
    console.log('\x07>> The import file does not exists: ' + tplName);
    return '';
  }

  if (filePath == t.file) {
    console.log('\x07>> You can not import a file into itself !');
    return '';
  }
  if ( t._recursion && !validReference(t, t.file) ) {
    console.log('\x07>> Recursion detected !', t.file);
    return '';
  }

  try {
    var data = Object.create(t);
    data.file = filePath;
    data._recursion = true;

    content = _.template(fs.readFileSync(filePath), data);
  } catch(e) {
    console.log('\x07>> ' + e.message);
  }

  return content;
}

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


/**
 * Check for circular references
 * @param  {object} t    The object containing all the paths
 * @param  {string} file The file being checked
 * @return {boolean} True if there are no circular refferences
 */
function validReference(t, file) {

  if ( ! t.prototype) {
    return true;
  }
  if( file == t.prototype.file ) {
    return false;
  }

  return validReferece(t.prototype, file)
}

