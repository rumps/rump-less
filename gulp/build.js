'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');
var rump = require('rump');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

gulp.task(rump.taskName('build:less'), function() {
  var sourcePath = path.join(rump.configs.main.paths.source.root,
                             rump.configs.main.paths.source.less);
  var source = path.join(sourcePath, rump.configs.main.globs.build.less);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.less);
  var sourceMap = rump.configs.main.styles.sourceMap;

  return gulp
    .src([source].concat(rump.configs.main.globs.global))
    .pipe((rump.configs.watch ? plumber : util.noop)())
    .pipe((sourceMap ? sourcemaps.init : util.noop)())
    .pipe(less(rump.configs.less))
    .pipe((sourceMap ? sourcemaps.write : util.noop)({
      sourceRoot: path.resolve(sourcePath)
    }))
    .pipe(gulp.dest(destination));
});

gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:less'));
