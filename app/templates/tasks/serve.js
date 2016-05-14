<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Serves the app in the dev server.
 */

import $ from '../config';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import path from 'path';
import _ from 'lodash';

const CONFIG = {
  server: {
    baseDir: global.PATHS.build
  },
  files: false,
  logLevel: 'silent',
  notify: false,
  open: true,
  port: global.ENV.PORT,
  development: {
    files: path.join(global.PATHS.build, '**', '*'),
    open: false,
    logLevel: 'info'
  },
  production: {
    ui: false
  }
};

gulp.task('serve', function() {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  browserSync.init(config, function(err, bs) {
    bs.addMiddleware('*', function(req, res) {
      res.writeHead(302, { location: '404.html' });
      res.end('Redirecting...');
    });
  });
});
