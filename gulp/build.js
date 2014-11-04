'use strict';

var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');
var rump = require('rump');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

gulp.task(rump.taskName('build:less'), function() {
  var source = path.join(rump.configs.main.paths.source.root,
                         rump.configs.main.paths.source.less,
                         rump.configs.main.globs.build.less);
  var destination = path.join(rump.configs.main.paths.destination.root,
                              rump.configs.main.paths.destination.less);

  return gulp
  .src([source].concat(rump.configs.main.globs.global))
  .pipe((rump.configs.watch ? plumber : util.noop)())
  .pipe((rump.configs.main.styles.sourceMap ? sourcemaps.init : util.noop)())
  .pipe(less(rump.configs.less))
  .pipe(autoprefixer(rump.configs.autoprefixer))
  .pipe((rump.configs.main.styles.sourceMap ? sourcemaps.write : util.noop)())
  .pipe(gulp.dest(destination));
});

gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:less'));
