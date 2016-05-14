<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
/**
 * @file Compiles JavaScript files. This task uses Webpack as the build/watch
 *       tool. To enable Webpack incremental builds whenever source files
 *       change, enable the --watch or --w flag. If in development environment,
 *       compression will be skipped and sourcemaps will be generated.
 */

import $ from '../config';
import gulp from 'gulp';
import path from 'path';
import util from 'gulp-util';
import webpack from 'webpack';
import _ from 'lodash';

const CONFIG = {
  context: path.join(global.PATHS.source, 'javascripts'),
  entry: {
    application: './application.js'
  },
  output: {
    path: path.join(global.PATHS.build, 'assets', 'javascripts'),
    publicPath: '/assets/javascripts/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [{
      test: /\.js/,
      loader: 'babel',
      include: path.join(global.PATHS.source, 'javascripts'),
      exclude: /node_modules/
    }, {
      test: /\.json/,
      loader: 'json',
      include: path.join(global.PATHS.config),
      exclude: /node_modules/
    }, {
      test: /\.jade/,
      loader: `jade?root=${path.join(global.PATHS.source, 'templates')}`,
      include: path.join(global.PATHS.source, 'templates'),
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jade'],
    root: [
      path.join(global.PATHS.source, 'javascripts'),
      path.join(global.PATHS.config, 'data'),
      path.join(global.PATHS.source, 'templates')
    ],
    modulesDirectories: [
      global.PATHS.modules
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ],
  development: {
    debug: true,
    devtool: 'eval-source-map'
  },
  production: {
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('common.js'),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
    ]
  }
};

gulp.task('scripts', function(callback) {
  const config = _.merge(_.omit(CONFIG, ['development', 'staging', 'production']), _.get(CONFIG, global.ENV.NODE_ENV));
  const shouldWatch = util.env['watch'] || util.env['w'];

  let guard = false;

  if ((global.ENV.NODE_ENV === 'development') && shouldWatch) {
    webpack(config).watch(100, build(callback));
  }
  else {
    if (shouldWatch) util.log(util.colors.yellow('Watch is not supported in production.'));
    webpack(config).run(build(callback));
  }

  function build(done) {
    return function(err, stats) {
      let details = stats.toJson();

      if (!shouldWatch && err) {
        done(err);
      }
      else if (!shouldWatch && details.errors.length > 0) {
        done(details.errors);
      }
      else {
        if (err)
          util.log(util.colors.green('[webpack]'), util.colors.red(err));
        else if (details.errors.length > 0)
          util.log(util.colors.green('[webpack]'), util.colors.red(stats.toString()));
        else
          util.log(util.colors.green('[webpack]'), stats.toString());

        if (!guard) {
          guard = true;
          done();
        }
      }
    };
  }
});
