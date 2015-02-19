'use strict';

var rump = module.exports = require('rump');
var configs = require('./configs');
var originalAddGulpTasks = rump.addGulpTasks;

rump.addGulpTasks = function(options) {
  originalAddGulpTasks(options);
  require('./gulp');
  return rump;
};

rump.on('update:main', function() {
  configs.rebuild();
  rump.emit('update:less');
});

Object.defineProperty(rump.configs, 'less', {
  get: function() {
    return configs.less;
  }
});
