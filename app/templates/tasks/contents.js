<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Fetches contents from Contentful using the Contentful JavaScript API.
 *       Use environment variables to provide access credentials:
 *
 *       CONTENTFUL_SPACE=<space_id>
 *       CONTENTFUL_ACCESS_TOKEN=<api_key_for_production_or_preview>
 *       CONTENTFUL_HOST=<api_host_for_production_or_preview>
 */

import $ from '../config';
import contentful from 'contentful';
import fs from 'fs-extra';
import gulp from 'gulp';
import moment from 'moment';
import path from 'path';
import util from 'gulp-util';
import _ from 'lodash';

const CONFIG = {
  output: global.PATHS.contents,
  layouts: {
    'case-study': 'case-study.jade'
  }
};

gulp.task('contents', function(callback) {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));

  if (!global.ENV.CONTENTFUL_SPACE || !global.ENV.CONTENTFUL_ACCESS_TOKEN) {
    util.log(util.colors.green('[contentful]'), util.colors.yellow('No access credentials set up'));
    callback();
    return;
  }

  contentful
    .createClient({
      space: global.ENV.CONTENTFUL_SPACE,
      accessToken: global.ENV.CONTENTFUL_ACCESS_TOKEN,
      host: global.ENV.CONTENTFUL_HOST
    })
    .getEntries()
    .then((res) => {
      let contents = {};

      util.log(util.colors.green('[contentful]'), `Fetched a total of ${res.total} entries out of a ${res.limit} limit`);

      res.items.forEach(function(item, i) {
        const contentType = item.sys.contentType.sys.id;

        // If content type is not part of a collection, store it in global variable.
        if (!$.collections[contentType]) {
          if (contents[contentType] === undefined) contents[contentType] = [];
          contents[contentType].push(item.fields);
        }
        // If content type is part of a collection, write it to the file system.
        else {
          const dir = path.join(config.output, contentType);
          const filename = `${moment(item.fields.date).format('YYYY-MM-DD')}-${_.kebabCase(item.fields.title)}.md`;
          util.log(util.colors.green('[contentful]'), `Entry ${i+1}: ${item.fields.title}, last updated on ${moment(item.sys.updatedAt).format('YYYY-MM-DD')}`);

          let frontMatter = '---\n';
          for (let k in item.fields) {
            if (k === 'body') continue;
            const v = item.fields[k];

            if (typeof v === 'string') {
              frontMatter += `${k}: '${v.replace('\'', '\'\'')}'\n`;
            }
            else if (v instanceof Array) {
              frontMatter += `${k}:\n`;

              v.forEach((item) => {
                if (typeof item === 'string')
                  frontMatter += `  - '${item.replace('\'', '\'\'')}'\n`;
              });
            }
            else if (v && v.fields && v.fields.file) {
              frontMatter += `${k}: '${v.fields.file.url}'\n`;
            }
          }
          frontMatter += `layout: '${config.layouts[contentType]}'\n`;
          frontMatter += '---\n\n';

          fs.mkdirsSync(dir);
          fs.writeFileSync(path.join(dir, filename), frontMatter + item.fields.body);
        }
      });

      global.CONTENTS = contents;

      callback();
    })
    .catch(function(err) {
      if (typeof err === 'string')
        callback(err);
      else
        callback(err.message);
    });
});
