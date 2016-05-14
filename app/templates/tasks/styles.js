<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Compiles stylesheets. If in development environment, compression will
 *       be skipped and sourcemaps will be generated.
 */

import $ from '../config';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import gulp from 'gulp';
import path from 'path';
import postcss from 'gulp-postcss';
import purifycss from 'gulp-purifycss';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import size from 'gulp-size';
import util from 'gulp-util';
import _ from 'lodash';

const CONFIG = {
  entry: path.join(global.PATHS.source, 'stylesheets', `*.{${global.FILE_TYPES.styles.join(',')}}`),
  output: path.join(global.PATHS.build, 'assets', 'stylesheets'),
  sass: {
    includePaths: [
      global.PATHS.modules,
      path.join(global.PATHS.source, 'stylesheets'),
      path.join(global.PATHS.config, 'data')
    ]
  },
  autoprefixer: null
};

gulp.task('styles', function() {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));
  const shouldWatch = util.env['watch'] || util.env['w'];

  let stream = gulp.src(config.entry);

  if (global.ENV.NODE_ENV === 'development') {
    stream = stream
      .pipe(sourcemaps.init())
      .pipe(sass(config.sass).on('error', function(err) {
        if (shouldWatch) {
          util.log(util.colors.green('[sass]'), util.colors.red(err));
          this.emit('end');
        }
        else {
          throw new util.PluginError('sass', err);
        }
      }))
      .pipe(postcss([
        autoprefixer(config.autoprefixer)
      ]))
      .pipe(sourcemaps.write('/'))
  }
  else {
    stream = stream
      .pipe(sass(config.sass).on('error', function(err) {
        throw new util.PluginError('sass', err);
      }))
      .pipe(purifycss([
        path.join(global.PATHS.build, '**', '*.js'),
        path.join(global.PATHS.build, '**', '*.html')
      ]))
      .pipe(postcss([
        autoprefixer(config.autoprefixer),
        cssnano()
      ]));
  }

  return stream
    .pipe(size({ title: '[styles]', gzip: true }))
    .pipe(gulp.dest(config.output));
});
