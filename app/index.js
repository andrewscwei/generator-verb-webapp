// (c) Studio Verb

'use strict';

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');
const _ = require('underscore.string');

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('projectname', {
      type: String,
      required: false
    });

    this.appname = _.slugify(this.projectname || this.appname);
    this.pkg = require('../package.json');

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });

    this.log(yosay('\'Allo \'allo! Out of the box I include Sass, Browserify and a gulpfile.js to build your app.'));
  },

  prompting: function() {
    let questions = [{
      type: 'input',
      name: 'appauthor',
      message: 'Who is the author? (this will appear in the header of your source files)'
    }];

    return this.prompt(questions).then(function(answers) {
      this.appauthor = answers.appauthor;
    }.bind(this));
  },

  writing: function() {
    let files = this.expandFiles('**', { dot: true, cwd: this.sourceRoot() });

    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      let src = path.join(this.sourceRoot(), f);
      let basename = path.basename(f);

      switch (basename) {
        case '.DS_Store':
          // Do nothing
          break;
        case 'gitignore':
          this.template(src, path.join(path.dirname(f), `.${basename}`));
          break;
        default:
          if (~['.png', '.jpg', '.ico'].indexOf(path.extname(basename)))
            this.copy(src, path.join(path.dirname(f), basename));
          else
            this.template(src, path.join(path.dirname(f), basename));
      }
    }
  },

  install: function() {
    if (this.options['skip-install']) {
      this.log('Skipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
    } else {
      this.log(chalk.magenta('Installing node modules for you using your ') + chalk.yellow.bold('package.json') + chalk.magenta('...'));
      this.installDependencies({ skipMessage: true, bower: false });
    }
  },

  end: function() {
    this.log(chalk.green('Finished generating app! See the generated ') + chalk.yellow('README.md') + chalk.green(' for more guidelines. To start developing right away, run: ') + chalk.yellow.bold('npm run dev'));
  },

  templateDirectory: function(source, destination) {
    if (source === undefined) source = '';
    if (destination === undefined) destination = '';

    let root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    let files = this.expandFiles('**', { dot: true, cwd: root });

    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      let src = path.join(root, f);
      let dest = path.join(destination, path.dirname(f), path.basename(f));

      if (path.basename(f) !== '.DS_Store') this.template(src, dest);
    }
  }
});
