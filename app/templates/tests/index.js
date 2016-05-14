<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
'use strict';

const async = require('async');
const browserSync = require('browser-sync');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const request = require('supertest');
const walk = require('walk');
const _ = require('lodash');

describe('app', function() {
  let app;

  before(function(done) {
    this.timeout(10000);
    browserSync.reset();

    app = browserSync.init({
      server: { baseDir: path.join(__dirname, '../', 'public') },
      open: false,
      logLevel: 'silent'
    }, done).instance;
  });

  after(function() {
    app.cleanup();
  })

  it('should not have broken links', function(done) {
    let paths = [];
    let error;

    let walker = walk.walkSync(path.join(__dirname, '../', 'public'), {
      listeners: {
        file: function(root, fileStats) {
          if (!_.endsWith(fileStats.name, '.html')) return;
          let res = fs.readFileSync(path.join(root, fileStats.name), 'utf-8').match(/["|']((\/)([a-zA-Z0-9\-\_\/\.]+))["|']/g);
          res.forEach((v, i) => {
            let p = v.replace(/("|')/g, '');
            if (!_.startsWith(p, '//') && !_.startsWith(p, 'http')) paths.push(p);
          });
        }
      }
    });

    async.eachSeries(_.uniq(paths), function(path, callback) {
      request(app.server)
        .get(path)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            error = err;
            console.log(chalk.red('Request failed for:'), path);
          }

          callback();
        });
    }, function() {
      if (error)
        throw error;
      else
        done();
    });
  });
});
