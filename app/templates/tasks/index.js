<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>/**
 * @file Default task - builds the entire app with the option to watch for
 *       changes and serve the app in the dev server.
 */

const $ = require('../config');
const gulp = <% if (sitetype === 'static') { %><% if (cms === 'prismic') { %>require('gulp-sys-metalprismic');<% } else if (cms === 'contentful') { %>require('gulp-sys-metalcontentful');<% } else { %>require('gulp-sys-metalsmith');<% } %><% } else { %>require('gulp-sys-assets');<% } %>
const task = require('../helpers/task-helpers');<% if (sitetype === 'static') { %>
const view = require('../helpers/view-helpers');<% } %>

gulp.init({
  base: task.src(),
  dest: task.dest(),
  scripts: {
    entry: { application: 'application.js' },
    resolve: { root: [task.config('data')] }
  }<% if (sitetype === 'static') { %>,
  views: <% if (cms === 'prismic') { %>process.env.PRISMIC_PREVIEWS_ENABLED ? false : <% } %>{
    i18n: view.i18n(),
    metadata: view.metadata(),
    collections: $.documents,
    watch: { files: [task.config('**/*')] }
  },
  sitemap: {
    siteUrl: $.url
  }<% } %>
});
