'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var convert = require('convert-source-map');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var path = require('path');
var rump = require('rump');
var through = require('through2');
var PluginError = util.PluginError;
var protocol = process.platform === 'win32' ? 'file:///' : 'file://';

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
    .pipe(less(rump.configs.less).on('error', function(err) {
      var pluginErr = new PluginError(rump.taskName('build:less'), err);
      util.log(pluginErr.toString());
      this.emit('end');
    }))
    .pipe((sourceMap ? sourcemaps.write : util.noop)())
    .pipe((sourceMap ? sourcemaps.init : util.noop)({loadMaps: true}))
    .pipe(autoprefixer(rump.configs.autoprefixer))
    .pipe((sourceMap ? sourcemaps.write : util.noop)())
    .pipe(sourceMap ? through.obj(sourceMapRewriter) : util.noop())
    .pipe(gulp.dest(destination));

  function sourceMapRewriter(file, enc, callback) {
    if(file.isNull()) {
      return callback(null, file);
    }

    var content = file.contents.toString();
    var sourceMap = convert.fromSource(content);
    var sources = sourceMap.getProperty('sources');
    var sourcesContent = sourceMap.getProperty('sourcesContent');
    sources.shift();
    sourcesContent.shift();
    sources = sources.map(rewriteUrl);
    sourceMap.setProperty('sourceRoot', null);
    sourceMap.setProperty('sources', sources);
    sourceMap.setProperty('sourcesContent', sourcesContent);
    content = convert.removeComments(content) +
      '\n/*# sourceMappingURL=data:application/json;base64,' +
      sourceMap.toBase64() +
      ' */';
    file.contents = new Buffer(content);
    callback(null, file);
  }

  function rewriteUrl(url) {
    url = url.replace(/^\/source\//, '');
    if(!/^(node_modules|bower_components)\//.test(url)) {
      url = path.normalize(path.join(sourcePath, url));
    }
    return protocol + path.resolve(url).split(path.sep).join('/');
  }
});

gulp.tasks[rump.taskName('build')].dep.push(rump.taskName('build:less'));
