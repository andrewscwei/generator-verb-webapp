<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Compiles template files using Metalsmith. If contents are fetched from
 *       Contentful prior to executing this task, they will be factored into
 *       this pipeline.
 */

import $ from '../config';
import branch from 'metalsmith-branch';
import collections from 'metalsmith-collections';
import gulp from 'gulp';
import i18n from 'metalsmith-i18n';
import inPlace from 'metalsmith-in-place';
import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
import metalsmith from 'metalsmith';
import moment from 'moment';
import path from 'path';
import paths from 'metalsmith-paths';
import permalinks from 'metalsmith-permalinks';
import requireDir from 'require-dir';
import sitemap from 'metalsmith-mapsite';
import util from 'gulp-util';
import _ from 'lodash';

const CONFIG = {
  entry: path.join(global.PATHS.source, 'templates', 'views'),
  output: global.PATHS.build,
  pretty: false,
  layouts: path.join(global.PATHS.source, 'templates', 'layouts'),
  metadata: {
    basedir: path.join(global.PATHS.source, 'templates'),
    config: $,
    data: requireDir(path.join(global.PATHS.config, 'data'), { recurse: true }),
    env: global.ENV,
    m: moment,
    _: _
  },
  i18n: {
    objectNotation: true,
    directory: path.join(global.PATHS.config, 'locales')
  },
  markdown: {
    gfm: true,
    tables: true
  },
  collections: $.collections
};

gulp.task('templates', function(callback) {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));
  const shouldWatch = util.env['watch'] || util.env['w'];

  let collectionsProps = {};
  let linksets = [];

  for (let collection in config.collections) {
    collectionsProps[collection] = config.collections[collection];
    collectionsProps[collection].pattern = path.join(path.relative(config.entry, global.PATHS.contents), collection, '**', '*');

    linksets.push({
      match: { collection: collection },
      pattern: config.collections[collection].permalink || path.join(collection, ':title')
    });
  }

  if (global.CONTENTS)
    config.metadata.data = _.merge(config.metadata.data, global.CONTENTS);

  metalsmith(__dirname)
    .clean(false)
    .source(config.entry)
    .destination(config.output)
    .metadata(config.metadata)
    .use(collections(collectionsProps))
    .use(branch(path.join(path.relative(config.entry, global.PATHS.contents), '**', '*.md'))
      .use(markdown(config.markdown))
      .use(permalinks({
        relative: false,
        linksets: linksets
      }))
      .use(paths({
        directoryIndex: 'index.html'
      }))
      .use(i18n(_.merge(config.i18n, {
        default: ($.locales && $.locales[0]) || 'en',
        locales: $.locales || ['en']
      })))
      .use(layouts({
        engine: 'jade',
        directory: config.layouts,
        pretty: config.pretty,
      }))
    )
    .use(branch(path.join('**', '*.jade'))
      .use(i18n(_.merge(config.i18n, {
        default: ($.locales && $.locales[0]) || 'en',
        locales: $.locales || ['en']
      })))
      .use(inPlace({
        engine: 'jade',
        pretty: config.pretty,
        rename: true
      }))
      .use(permalinks({
        relative: false
      }))
    )
    .use(sitemap({
      hostname: $.url,
      omitExtension: true
    }))
    .build(function(err) {
      if (err) {
        if (shouldWatch) {
          util.log(util.colors.green('[metalsmith]'), util.colors.red(err));
          callback();
        }
        else {
          callback(err);
        }
      }
      else {
        callback();
      }
    });
});
