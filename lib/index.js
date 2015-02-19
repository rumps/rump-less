'use strict';

var rump = module.exports = require('rump');
var configs = require('./configs');
var originalAddGulpTasks = rump.addGulpTasks;

// TODO remove on next major core update
rump.addGulpTasks = function(options) {
  originalAddGulpTasks(options);
  require('./gulp');
  return rump;
};

rump.on('update:main', function() {
  configs.rebuild();
  rump.emit('update:less');
});

rump.on('gulp:main', function(options) {
  require('./gulp');
  rump.emit('gulp:less', options);
});

Object.defineProperty(rump.configs, 'less', {
  get: function() {
    return configs.less;
  }
});
