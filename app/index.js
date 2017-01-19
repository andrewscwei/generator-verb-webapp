// (c) Studio Verb

'use strict';

const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
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

    this.option('s', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });

    this.log(yosay('\'Allo \'allo! This is a web app generator.'));
  },

  prompting: function() {
    let questions = [{
      type: 'input',
      name: 'appauthor',
      message: 'Who is the author? (this will appear in the copyright header of your source files)'
    }, {
      type: 'list',
      name: 'sitetype',
      message: 'Is this a static or dynamic website?',
      choices: [{
        name: 'Static (Metalsmith)',
        value: 'static'
      }, {
        name: 'Dynamic (Express)',
        value: 'dynamic'
      }]
    }, {
      type: 'list',
      name: 'cms',
      message: 'Do you need CMS support?',
      choices: [{
        name: 'No',
        value: false
      }, {
        name: 'Prismic.io',
        value: 'prismic'
      }, {
        name: 'Contentful',
        value: 'contentful'
      }]
    },{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Client-side routing',
        value: 'routing',
        checked: false
      }, {
        name: 'CircleCI config',
        value: 'circleci',
        checked: false
      }, {
        name: 'Heroku config',
        value: 'heroku',
        checked: false
      }, {
        name: 'Docker',
        value: 'docker',
        checked: false
      }]
    }];

    return this.prompt(questions).then(answers => {
      const features = answers.features || [];

      this.appauthor = answers.appauthor;
      this.sitetype = answers.sitetype;
      this.cms = answers.cms;
      this.routing = features.indexOf('routing') > -1;
      this.circleci = features.indexOf('circleci') > -1;
      this.heroku = features.indexOf('heroku') > -1;
      this.docker = features.indexOf('docker') > -1;
    });
  },

  writing: function() {
    let files = glob.sync('**', { dot: true, cwd: this.sourceRoot(), nodir: true });

    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      let src = path.join(this.sourceRoot(), f);
      let dirname = path.dirname(f);
      let basename = path.basename(f);
      let ignores = [];

      if ((this.cms !== 'prismic') || (this.sitetype !== 'dynamic')) ignores.push('prismic-helpers.js');
      if (this.sitetype !== 'dynamic') ignores.push('view-helpers.js');
      if (!this.circleci) ignores.push('circle.yml');
      if (!this.heroku) ignores.push('.buildpacks');
      if (!this.docker) ignores.push('dockerfile', 'dockerfile.dev', 'makefile');
      if ((this.sitetype === 'static') && (this.cms !== 'prismic')) ignores.push('app.js');
      if (this.sitetype === 'static') ignores.push('500.pug');

      switch (basename) {
        case '.DS_Store':
          // Do nothing
          break;
        case 'gitignore':
        case 'env':
          this.template(src, path.join(path.dirname(f), `.${basename}`));
          break;
        default:
          if (~['.png', '.jpg', '.ico'].indexOf(path.extname(basename))) {
            this.copy(src, path.join(path.dirname(f), basename));
          }
          else if (ignores.indexOf(basename) < 0) {
            if ((this.sitetype === 'static') && (this.cms !== 'prismic') && (_.endsWith(dirname, 'routes'))) break;
            if ((this.sitetype === 'static') && (this.cms !== 'prismic') && (_.endsWith(dirname, 'logs'))) break;
            this.template(src, path.join(path.dirname(f), basename));
          }
      }
    }
  },

  install: function() {
    if (this.options['skip-install'] || this.options['s']) {
      this.log('Skipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
    } else {
      this.log(chalk.magenta('Installing node modules for you using your ') + chalk.yellow.bold('package.json') + chalk.magenta('...'));
      this.installDependencies({ skipMessage: true, bower: false });
    }
  },

  end: function() {
    this.log(chalk.green('Finished generating app! See the generated ') + chalk.yellow('README.md') + chalk.green(' for more guidelines. To start developing right away, run: ') + chalk.yellow.bold('npm run dev'));
  }
});
