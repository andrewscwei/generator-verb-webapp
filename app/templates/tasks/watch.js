<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Watches files for changes.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import util from 'gulp-util';
import _ from 'lodash';

const CONFIG = {
  images: {
    files: path.join(global.PATHS.source, 'images', '**', `*.{${global.FILE_TYPES.images.join(',')}}`),
    tasks: ['images']
  },
  videos: {
    files: path.join(global.PATHS.source, 'videos', '**', `*.{${global.FILE_TYPES.videos.join(',')}}`),
    tasks: ['videos']
  },
  styles: {
    files: path.join(global.PATHS.source, 'stylesheets', '**', `*.{${global.FILE_TYPES.styles.join(',')}}`),
    tasks: ['styles']
  },
  templates: {
    files: path.join(global.PATHS.source, 'templates', '**', `*.{${global.FILE_TYPES.templates.join(',')}}`),
    tasks: ['templates']
  },
  config: {
    files: path.join(global.PATHS.config, '**', `*`),
    tasks: ['templates']
  }
};

gulp.task('watch', function() {
  if (global.ENV.NODE_ENV !== 'development') {
    util.log(util.colors.yellow('Watch is only supported in development.'));
    return;
  }

  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  for (let key in config) {
    let entry = config[key];
    gulp.watch(entry.files, entry.tasks);
  }
});
