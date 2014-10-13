'use strict';

var extend = require('extend');
var path = require('path');
var rump = require('rump');

exports.rebuild = function() {
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

  exports.autoprefixer = extend(true, {},
                                rump.configs.main.styles.autoprefixer);
  exports.less = extend(true, {
    compress: rump.configs.main.styles.minify,
    paths: [
      'node_modules',
      'bower_components',
      path.join(rump.configs.main.paths.source.root,
                rump.configs.main.paths.source.less)
    ]
  }, rump.configs.main.styles.less);
};

exports.rebuild();
