'use strict';

var assert = require('better-assert');
var fs = require('graceful-fs');
var gulp = require('gulp');
var util = require('gulp-util');
var any = require('lodash/collection/any');
var toArray = require('lodash/lang/toArray');
var path = require('path');
var sinon = require('sinon');
var rump = require('../lib');
var configs = require('../lib/configs');

describe('rump less tasks', function() {
  var original;

  before(function() {
    original = fs.readFileSync('test/src/lib/variables.less').toString();
  });

  beforeEach(function() {
    rump.configure({
      environment: 'development',
      paths: {
        source: {
          root: 'test/src',
          less: ''
        },
        destination: {
          root: 'tmp',
          less: ''
        }
      }
    });
    configs.watch = false;
  });

  after(function() {
    fs.writeFileSync('test/src/lib/variables.less', original);
  });

  it('are added and defined', function() {
    var callback = sinon.spy();
    rump.on('gulp:main', callback);
    rump.on('gulp:less', callback);
    rump.addGulpTasks({prefix: 'spec'});
    // TODO Remove no callback check on next major core update
    assert(!callback.called || callback.calledTwice);
    assert(gulp.tasks['spec:info:less']);
    assert(gulp.tasks['spec:build:less']);
    assert(gulp.tasks['spec:watch:less']);
  });

  it('info:less', function() {
    var oldLog = console.log;
    var logs = [];
    console.log = function() {
      logs.push(util.colors.stripColor(toArray(arguments).join(' ')));
    };
    gulp.start('spec:info');
    console.log = oldLog;
    assert(any(logs, hasPaths));
    assert(any(logs, hasLessFile));
    assert(!any(logs, hasVariablesFile));
  });

  it('build:less, watch:less', function(done) {
    gulp.task('postbuild', ['spec:watch'], function() {
      var firstResult = fs.readFileSync('tmp/index.css').toString();
      assert(~firstResult.indexOf('display: flex'));
      assert(~firstResult.indexOf('display: -webkit-flex'));
      timeout(function() {
        fs.writeFileSync('test/src/lib/variables.less', '@color: black;');
        timeout(function() {
          var secondResult = fs.readFileSync('tmp/index.css').toString();
          assert(firstResult !== secondResult);
          rump.reconfigure({environment: 'production'});
          fs.writeFileSync('test/src/lib/variables.less', '@color: white;');
          timeout(function() {
            var thirdResult = fs.readFileSync('tmp/index.css').toString();
            assert(firstResult.length > thirdResult.length);
            assert(secondResult.length > thirdResult.length);
            done();
          }, 950);
        }, 950);
      }, 950);
    });
    gulp.start('postbuild');
  });
});

function hasLessFile(log) {
  return log === 'index.less';
}

function hasVariablesFile(log) {
  return ~log.indexOf('variables.less');
}

function hasPaths(log) {
  return ~log.indexOf(path.join('test', 'src')) && ~log.indexOf('tmp');
}

function timeout(cb, delay) {
  process.nextTick(function() {
    setTimeout(function() {
      process.nextTick(cb);
    }, delay || 0);
  });
}
