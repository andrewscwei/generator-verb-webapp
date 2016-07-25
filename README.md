# generator-verb-webapp [![CircleCI](https://circleci.com/gh/StudioVerb/generator-verb-webapp.svg?style=svg&circle-token=d22c55a7cda54ba18131f6ccc998a38655bd7f90)](https://circleci.com/gh/StudioVerb/generator-verb-webapp) [![npm version](https://badge.fury.io/js/generator-verb-webapp.svg)](https://badge.fury.io/js/generator-verb-webapp)

Verb's Yeoman generator for a static web app.

## Features

- [gulp-sys-metalprismic](https://www.npmjs.com/package/gulp-sys-metalprismic) Gulp build system
  - [Metalsmith](http://metalsmith.io) static template generator
  - [Sass](http://sass-lang.com) -> minified CSS
  - [Webpack](https://webpack.github.io/)
  - [Babel](https://babeljs.io) ES6 -> ES5
  - [BrowserSync](http://www.browsersync.io) as dev server
  - [Prismic.io](http://prismic.io) support
  - Static asset revisioning (appending content hash to filenames)
  - CDN path remapping
  - i18n support
- Client-side routing with [page-manager](https://www.npmjs.com/package/page-manager)
- [CircleCI](https://circleci.com/) integration
- [H5BP favicon and app icon template](http://littlewebgiants.com/favicon-and-app-icon-template/)

## Requirements

1. [Node](https://nodejs.org) `>=v6.1.0`

## Structure

```
.
+-- .buildpacks
+-- .editorconfig
+-- .gitignore
+-- .jshintrc
+-- .nvmrc
+-- .secrets
+-- app
|   +-- documents
|   +-- fonts
|   +-- images
|   +-- javascripts
|   |   +-- application.js
|   +-- stylesheets
|   |   +-- base
|   |   |   +-- definitions.sass
|   |   |   +-- layout.sass
|   |   |   +-- palette.sass
|   |   |   +-- typography.sass
|   |   +-- views
|   |   |   +-- errors.sass
|   |   |   +-- home.sass
|   |   +-- application.sass
|   +-- templates
|   |   +-- layouts
|   |   |   +-- base.jade
|   |   |   +-- page.jade
|   |   +-- views
|   |   |   +-- 404.jade
|   |   |   +-- 500.jade
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
|   +-- routes
|   |   +-- prismic.js
|   +-- index.json
+-- node_modules
+-- public
+-- tasks
|   +-- index.js
+-- test
|   +-- index.js
+-- app.js
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
