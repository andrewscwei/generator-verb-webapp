<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Applies content hash fingerprinting to all built assets, such as
 *       images, videos, stylesheets and JavaScript files. When done, this task
 *       will crawl through all built template files and remaps the original
 *       asset tasks.paths with the fingerprinted version. If a CDN_PATH
 *       environment variable is provided, it will prefix all fingerprinted
 *       asset tasks.paths with the CDN path.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import rimraf from 'rimraf';
import replace from 'gulp-replace';
import rev from 'gulp-rev';
import _ from 'lodash';

const CONFIG = {
  entry: path.join(global.PATHS.build, `**/*.{${_.concat(global.FILE_TYPES.images, global.FILE_TYPES.videos, global.FILE_TYPES.fonts, global.FILE_TYPES.styles, global.FILE_TYPES.scripts).join(',')}}`),
  output: global.PATHS.build,
  replace: path.join(global.PATHS.build, `**/*.{${_.concat(global.FILE_TYPES.templates, global.FILE_TYPES.styles, global.FILE_TYPES.scripts).join(',')}}`),
  manifestFile: 'rev-manifest.json'
};

gulp.task('rev', function(callback) {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  gulp.src(config.entry)
    .pipe(rev())
    .pipe(gulp.dest(config.output))
    .pipe(rev.manifest(config.manifestFile))
    .pipe(gulp.dest(config.output))
    .on('end', function() {
      const manifestFile = path.join(config.output, config.manifestFile);
      const manifest = require(manifestFile);
      let removables = [];
      let pattern = (_.keys(manifest)).join('|');

      for (let v in manifest) {
        if (v !== manifest[v]) removables.push(path.join(config.output, v));
      }

      removables.push(manifestFile);

      rimraf(`{${removables.join(',')}}`, function() {
        if (global.ENV.CDN_PATH) {
          gulp.src(config.replace)
            .pipe(replace(new RegExp(`((?:\\.?\\.\\/?)+)?([\\/\\da-z\\.-]+)(${pattern})`, 'gi'), (m) => {
              let k = m.match(new RegExp(pattern, 'i'))[0];
              let v = manifest[k];
              return m.replace(k, v).replace(/^((?:\.?\.?\/?)+)?/, _.endsWith(global.ENV.CDN_PATH, '/') ? global.ENV.CDN_PATH : `${global.ENV.CDN_PATH}/`);
            }))
            .pipe(gulp.dest(config.output))
            .on('end', callback)
            .on('error', callback);
        }
        else {
          gulp.src(config.replace)
            .pipe(replace(new RegExp(`${pattern}`, 'gi'), (m) => (manifest[m])))
            .pipe(gulp.dest(config.output))
            .on('end', callback)
            .on('error', callback);
        }
      });
    })
    .on('error', callback);
});
