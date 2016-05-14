# generator-verb-webapp[![Circle CI](https://circleci.com/gh/StudioVerb/generator-verb-webapp/tree/master.svg?style=svg)](https://circleci.com/gh/StudioVerb/generator-verb-webapp/tree/master) [![npm version](https://badge.fury.io/js/generator-verb-webapp.svg)](https://badge.fury.io/js/generator-verb-webapp)

Verb's Yeoman generator for a static web app.

## Features

- [Metalsmith](http://metalsmith.io) static template generator
- [Gulp](http://gulpjs.com) asset pipeline
  - [Sass](http://sass-lang.com) -> minified CSS
  - [Babel](https://babeljs.io) ES6 -> ES5
  - Static asset revisioning (appending content hash to filenames)
- [Webpack](https://webpack.github.io/)
- [BrowserSync](http://www.browsersync.io) as dev server
- [CircleCI](https://circleci.com/) integration
- [Contentful](http://contentful.com) support
- i18n support
- CDN path remapping
- [H5BP favicon and app icon template](http://littlewebgiants.com/favicon-and-app-icon-template/)

## Requirements

1. [Node](https://nodejs.org) `>=v5.0.0`

## Structure

```
.
+-- .babelrc
+-- .editorconfig
+-- .gitignore
+-- .jshintrc
+-- .nvmrc
+-- app
|   +-- fonts
|   +-- images
|   +-- javascripts
|   |   +-- managers
|   |   |   +-- PageManager.js
|   |   +-- application.js
|   +-- stylesheets
|   |   +-- base
|   |   |   +-- definitions.sass
|   |   |   +-- layout.sass
|   |   |   +-- palette.sass
|   |   |   +-- typography.sass
|   |   +-- views
|   |   |   +-- 404.sass
|   |   |   +-- welcome.sass
|   |   +-- application.sass
|   +-- templates
|   |   +-- layouts
|   |   |   +-- base.jade
|   |   +-- views
|   |   |   +-- 404.jade
|   |   |   +-- index.jade
|   +-- videos
|   +-- apple-touch-icon-180x180-precomposed.png
|   +-- apple-touch-icon-152x152-precomposed.png
|   +-- apple-touch-icon-144x144-precomposed.png
|   +-- apple-touch-icon-120x120-precomposed.png
|   +-- apple-touch-icon-114x114-precomposed.png
|   +-- apple-touch-icon-76x76-precomposed.png
|   +-- apple-touch-icon-72x72-precomposed.png
|   +-- apple-touch-icon-60x60-precomposed.png
|   +-- apple-touch-icon-57x57-precomposed.png
|   +-- apple-touch-icon-precomposed.png
|   +-- browserconfig.xml
|   +-- favicon.ico
|   +-- favicon.png
|   +-- large.png
|   +-- launcher-icon-0-75x.png
|   +-- launcher-icon-1-5x.png
|   +-- launcher-icon-1x.png
|   +-- launcher-icon-2x.png
|   +-- launcher-icon-3x.png
|   +-- launcher-icon-4x.png
|   +-- manifest.json
|   +-- og-image.png
|   +-- robots.txt
|   +-- square.png
|   +-- tiny.png
|   +-- wide.png
+-- config
|   +-- data
|   +-- locales
|   |   +-- en.json
|   +-- index.json
+-- node_modules
+-- public
+-- tasks
|   +-- clean.js
|   +-- contents.js
|   +-- extras.js
|   +-- fonts.js
|   +-- images.js
|   +-- index.babel.js
|   +-- rev.js
|   +-- scripts.js
|   +-- serve.js
|   +-- styles.js
|   +-- templates.js
|   +-- videos.js
|   +-- watch.js
+-- test
|   +-- index.js
+-- circle.yml
+-- package.json
+-- README.md
```

## Usage

Install `yo` and `generator-verb-webapp`:
```
$ npm install -g yo generator-verb-webapp
```

Create a new directory for your project and `cd` into it:
```
$ mkdir new-project-name && cd $_ 
```

Generate the project:
```
$ yo verb-webapp [app-name]
```

For details on initial setup procedures of the project, see its generated ```README.md``` file.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
