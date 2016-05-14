<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Default task - builds the entire app with the option to watch for
 *       changes and serve the app in the dev server.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import sequence from 'run-sequence';
import util from 'gulp-util';

// Environment variables.
global.ENV = {
  CDN_PATH: ((process.env.CIRCLE_BRANCH === 'master' || process.env.CIRCLE_BRANCH === '' || !process.env.CIRCLE_BRANCH) && process.env.CDN_PATH),
  CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE,
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_HOST: process.env.CONTENTFUL_HOST,
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 3000
};

// Paths.
global.PATHS = {
  config: path.join(__dirname, '../', 'config'),
  modules: path.join(__dirname, '../', 'node_modules'),
  contents: path.join(__dirname, '../', 'app', 'templates', 'views', '.tmp'),
  source: path.join(__dirname, '../', 'app'),
  build: path.join(__dirname, '../', 'public')
};

// File types.
global.FILE_TYPES = {
  contents: ['md'],
  images: ['jpg', 'jpeg', 'gif', 'png', 'svg'],
  videos: ['ogv', 'mp4'],
  fonts: ['eot', 'svg', 'ttf', 'woff', 'woff2'],
  styles: ['css', 'sass', 'scss'],
  scripts: ['js', 'coffee'],
  templates: ['html', 'jade', 'md']
};

require('./clean');
require('./images');
require('./videos');
require('./fonts');
require('./extras');
require('./contents');
require('./templates');
require('./styles');
require('./scripts');
require('./rev');
require('./watch');
require('./serve');

for (let k in global.ENV) util.log(util.colors.magenta(k), '=', global.ENV[k]);

gulp.task('default', function(callback) {
  const shouldWatch = util.env['watch'] || util.env['w'];
  const shouldServe = util.env['serve'] || util.env['s'];

  let seq = ['clean', 'images', 'videos', 'fonts', 'extras', 'contents', 'templates', 'scripts', 'styles'];
  if (global.ENV.NODE_ENV !== 'development') seq.push('rev');
  if (shouldServe) seq.push('serve');
  if (shouldWatch) seq.push('watch');
  seq.push(callback);
  sequence.apply(null, seq);
});
