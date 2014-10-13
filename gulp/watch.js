'use strict';

var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task('rump:watch:less', ['rump:build:less'], function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.less,
                       rump.configs.main.globs.watch.less);
  gulp.watch([glob].concat(rump.configs.main.globs.global),
             ['rump:build:less']);
});

gulp.tasks['rump:watch'].dep.push('rump:watch:less');
