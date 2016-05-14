<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Compiles image files.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import size from 'gulp-size';
import _ from 'lodash';

const CONFIG = {
  entry: path.join(global.PATHS.source, `images/**/*.{${global.FILE_TYPES.images.join(',')}}`),
  output: path.join(global.PATHS.build, 'assets/images')
};

gulp.task('images', function() {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  return gulp.src(config.entry)
    .pipe(size({ title: '[images]', gzip: true }))
    .pipe(gulp.dest(config.output));
});
