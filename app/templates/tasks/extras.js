<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Compiles extra files such as favicons, app icons and robots.txt.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import size from 'gulp-size';
import _ from 'lodash';

const CONFIG = {
  entry: path.join(global.PATHS.source, '*.*'),
  output: path.join(global.PATHS.build)
};

gulp.task('extras', function() {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  return gulp.src(config.entry)
    .pipe(size({ title: '[extras]', gzip: true }))
    .pipe(gulp.dest(config.output));
});
