'use strict';

var rump = module.exports = require('rump');
var configs = require('./configs');
var originalAddGulpTasks = rump.addGulpTasks;

rump.addGulpTasks = function() {
  originalAddGulpTasks();
  require('./gulp');
  return rump;
};

rump.on('update:main', function() {
  configs.rebuild();
  rump.emit('update:less');
});

Object.defineProperty(rump.configs, 'autoprefixer', {
  get: function() {
    return configs.autoprefixer;
  }
});

Object.defineProperty(rump.configs, 'less', {
  get: function() {
    return configs.less;
  }
});