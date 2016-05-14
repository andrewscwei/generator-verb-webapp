<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Compiles font files.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import size from 'gulp-size';
import _ from 'lodash';

const CONFIG = {
  entry: path.join(global.PATHS.source, `fonts/**/*.{${global.FILE_TYPES.fonts.join(',')}}`),
  output: path.join(global.PATHS.build, 'assets/fonts')
};

gulp.task('fonts', function() {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  return gulp.src(config.entry)
    .pipe(size({ title: '[fonts]', gzip: true }))
    .pipe(gulp.dest(config.output));
});
