'use strict';

var gulp = require('gulp');
var path = require('path');
var rump = require('rump');

gulp.task(rump.taskName('watch:less'),
          [rump.taskName('build:less')],
          function() {
  var glob = path.join(rump.configs.main.paths.source.root,
                       rump.configs.main.paths.source.less,
                       rump.configs.main.globs.watch.less);
  gulp.watch([glob].concat(rump.configs.main.globs.global),
             [rump.taskName('build:less')]);
});

gulp.tasks[rump.taskName('watch')].dep.push(rump.taskName('watch:less'));
