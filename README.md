# Rump LESS
[![NPM](http://img.shields.io/npm/v/rump-less.svg?style=flat-square)](https://www.npmjs.org/package/rump-less)
![License](http://img.shields.io/npm/l/rump-less.svg?style=flat-square)
[![Travis](http://img.shields.io/travis/rumps/rump-less.svg?style=flat-square&label=travis)](https://travis-ci.org/rumps/rump-less)
[![Appveyor](http://img.shields.io/appveyor/ci/jupl/rump-less.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/jupl/rump-less)
[![Dependencies](http://img.shields.io/david/rumps/rump-less.svg?style=flat-square)](https://david-dm.org/rumps/rump-less)
[![Dev Dependencies](http://img.shields.io/david/dev/rumps/rump-less.svg?style=flat-square)](https://david-dm.org/rumps/rump-less#info=devDependencies)


## About
Rump LESS is a Rump module for styles authored in [LESS](http://lesscss.org/)
with [Autoprefixer](https://github.com/postcss/autoprefixer) included. For more
information, visit the
[Rump repository](https://github.com/rumps/rump).


## API
The following is appended to the core Rump API:

### `rump.addGulpTasks(options)`
This module adds the following tasks:

- `build:less` will process LESS stylesheets with LESS and Autoprefixer. For
more information on source and destination paths see `rump.configure()` below.
This task is also added to the `build` task.
- `watch:less` will run `build:less`, then monitor for changes and process
updated files as needed. This task is also added to the `watch` task.
- `info:less` will display information on what this specific module does,
specifically the source and destination paths as well as what files would get
processed. This task is also added to the `info` task.

### `rump.configure(options)`
Redefine options for Rump and Rump modules to follow. In addition to what
options Rump and other Rump modules offer, the following options are
available alongside default values:

#### `options.paths.source.less` (`'styles'`)
This is the directory where styles to be processed are contained. This path is
relative to the root source path. (If the default root and LESS path is used,
then the path would be `src/styles`)

#### `options.paths.destination.less` (`'styles'`)
This is the directory where styles are copied to. This path is relative to the
root destination path. (If the default root and LESS path is used, then the
path would be `dist/styles`)

#### `options.globs.build.less` (`'*.less'`)
This specifies which stylesheets to process. By default it processes all LESS
files in the immediate directory of the root source path for styles.

#### `options.globs.watch.less` (`'**/*.less'`)
This specifies which stylesheets to monitor for changes. By default it watches
all LESS files in the root source path for styles, including those in
subdirectories.

#### `options.styles.minify` (`options.environment === 'production'`)
This specifies whether to minify generated CSS. (minified if `true`) By default
CSS is minified only if the environment is set to production. (visit the main
Rump repository for more information on environment)

#### `options.styles.sourceMap` (`options.environment === 'development'`)
This specifies whether to include inline source maps to generated CSS. (source
maps included if `true`) By default source maps are included only if the
environment is set to development. (visit the main Rump repository for more
information on environment)

#### `options.styles.autoprefixer`
This specifies any options you want to add to Autoprefixer. (specifically
[less-plugin-autoprefix](https://github.com/less/less-plugin-autoprefix))

#### `options.styles.less`
This specifies any options you want to override in LESS. (specifically
[gulp-less](https://github.com/plus3network/gulp-less)) Compression plugin by
default is included or excluded based on the minify option above. Default
search paths for `@import` are also added, including: `node_modules`,
`bower_components`, and root source path for styles detailed above.

### `rump.configs.less`
This contains the generated options that are passed to LESS in the Gulp task.
This is a good way to see what options are generated based on defaults and
overrides.
