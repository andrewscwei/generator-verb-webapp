<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Cleans built directories.
 */

import $ from '../config';
import gulp from 'gulp';
import rimraf from 'rimraf';
import _ from 'lodash';

const CONFIG = {
  entry: [global.PATHS.build, global.PATHS.contents]
};

gulp.task('clean', function(callback) {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));
  rimraf(`{${config.entry.join(',')}}`, callback);
});
