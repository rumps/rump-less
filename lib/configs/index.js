'use strict';

var AutoprefixPlugin = require('less-plugin-autoprefix');
var CleanCSSPlugin = require('less-plugin-clean-css');
var extend = require('extend');
var path = require('path');
var rump = require('rump');

exports.rebuild = function() {
  var plugins = [];

  rump.configs.main.globs = extend(true, {
    build: {
      less: '*.less'
    },
    watch: {
      less: '**/*.less'
    }
  }, rump.configs.main.globs);

  rump.configs.main.paths = extend(true, {
    source: {
      less: 'styles'
    },
    destination: {
      less: 'styles'
    }
  }, rump.configs.main.paths);

  rump.configs.main.styles = extend(true, {
    minify: rump.configs.main.environment === 'production',
    sourceMap: rump.configs.main.environment === 'development'
  }, rump.configs.main.styles);

  // plugins.push(new AutoprefixPlugin(rump.configs.main.styles.autoprefixer));

  if(rump.configs.main.styles.minify) {
    plugins.push(new CleanCSSPlugin({advanced: true}));
  }

  exports.less = extend(true, {
    paths: [
      'node_modules',
      'bower_components',
      path.join(rump.configs.main.paths.source.root,
                rump.configs.main.paths.source.less)
    ],
    plugins: plugins
  }, rump.configs.main.styles.less);
};

exports.rebuild();
