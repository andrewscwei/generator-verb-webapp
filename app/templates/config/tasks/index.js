<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>/**
 * @file Default task - builds the entire app with the option to watch for
 *       changes and serve the app in the dev server.
 */

const $ = require('../');
const gulp = <% if (sitetype === 'static') { %><% if (cms === 'prismic') { %>require('gulp-sys-metalprismic');<% } else if (cms === 'contentful') { %>require('gulp-sys-metalcontentful');<% } else { %>require('gulp-sys-metalsmith');<% } %><% } else { %>require('gulp-sys-assets');<% } %>
const path = require('path');

const baseDir = path.join(__dirname, '../../');

gulp.init({
  base: path.join(baseDir, $.sourceDir),
  dest: path.join(baseDir, $.buildDir),
  scripts: {
    entry: { application: 'application.js' },
    resolve: { root: [path.join(baseDir, $.configDir, 'data')] }
  }<% if (sitetype === 'static') { %>,
  views: <% if (cms === 'prismic') { %>process.env.PRISMIC_PREVIEWS_ENABLED ? false : <% } %>{
    i18n: {
      locales: $.locales || ['en'],
      directory: path.join(baseDir, $.configDir, 'locales')
    },
    metadata: {
      _: require('lodash'),
      $: $,
      data: require('require-dir')(path.join(baseDir, $.configDir, 'data'), { recurse: true }),
      env: process.env,
      m: require('moment')
    },
    collections: $.collections,
    watch: { files: [path.join(baseDir, $.configDir, '**/*')] }
  },
  sitemap: {
    siteUrl: $.url
  }<% } %>
});
