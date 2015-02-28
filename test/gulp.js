'use strict';

// Temporary fix until old LoDash is updated in some Gulp dependency
Object.getPrototypeOf.toString = function() {
  return 'function getPrototypeOf() { [native code] }';
};

var assert = require('assert');
var bufferEqual = require('buffer-equal');
var co = require('co');
var fs = require('mz/fs');
var gulp = require('gulp');
var util = require('gulp-util');
var path = require('path');
var sinon = require('sinon');
var sleep = require('timeout-then');
var rump = require('../lib');

describe('rump less tasks', function() {
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
  });

  it('are added and defined', function() {
    this.timeout(20000);
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

  it('displays correct information in info task', function() {
    var oldLog = console.log;
    var logs = [];
    console.log = function() {
      logs.push(util.colors.stripColor(Array.from(arguments).join(' ')));
    };
    gulp.start('spec:info');
    console.log = oldLog;
    assert(logs.some(hasPaths));
    assert(logs.some(hasLessFile));
    assert(!logs.some(hasVariablesFile));
  });

  describe('for building', function() {
    var originals;

    before(co.wrap(function*() {
      originals = yield [
        fs.readFile('test/src/index.less'),
        fs.readFile('test/src/lib/variables.less')
      ];
    }));

    before(function(done) {
      gulp.task('postbuild', ['spec:watch'], function() {
        done();
      });
      gulp.start('postbuild');
    });

    afterEach(co.wrap(function*() {
      yield sleep(800);
      yield [
        fs.writeFile('test/src/index.less', originals[0]),
        fs.writeFile('test/src/lib/variables.less', originals[1])
      ];
      yield sleep(800);
    }));

    it('handles updates', co.wrap(function*() {
      var firstContent = yield fs.readFile('tmp/index.css');
      yield sleep(800);
      fs.writeFileSync('test/src/lib/variables.less', '@color: black;');
      yield sleep(800);
      var secondContent = yield fs.readFile('tmp/index.css');
      assert(!bufferEqual(firstContent, secondContent));
    }));

    it('handles autoprefix', co.wrap(function*() {
      var content = yield fs.readFile('tmp/index.css');
      assert(content.toString().includes('display: flex'));
      assert(content.toString().includes('display: -webkit-flex'));
    }));

    it('handles minification in production', co.wrap(function*() {
      var firstContent = yield fs.readFile('tmp/index.css');
      rump.reconfigure({environment: 'production'});
      yield sleep(800);
      fs.writeFileSync('test/src/lib/variables.less', '@color: orange;');
      yield sleep(800);
      var secondContent = yield fs.readFile('tmp/index.css');
      assert(firstContent.length > secondContent.length);
    }));
  });
});

function hasLessFile(log) {
  return log === 'index.less';
}

function hasVariablesFile(log) {
  return log.includes('variables.less');
}

function hasPaths(log) {
  return log.includes(path.join('test', 'src')) && log.includes('tmp');
}
