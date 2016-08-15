<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
'use strict';

import $ from '../../config';
import _ from 'lodash';<% if (routing) { %>
import pm from 'page-manager';

pm.locales = $.locales;
pm.autoRouting = $.autoRouting;

// Put page routing/transitioning/loading logic here.
// pm.request((newDocument, oldDocument, next) => {
//   // Manipulate DOM per request.
//   next();
// });

// pm.transition('in', (next) => {
//   // Transition-in behavior for all paths.
//   next();
// });

// pm.transition('out', '/about', (next) => {
//   // Transition-out behavior of the '/about' page into any other page.
//   next();
// });

// pm.transition('out', '/', '/about', (next) => {
//   // Transition-out behavior specifically for '/' going into '/about'.
//   next();
// });

// pm.on('beforeLoad', (next) => {
//   // Do something before image preloading for all pages.
//   next();
// });

// pm.on('loading', '/gallery', (loaded, total) => {
//   // Do something while images are preloading only in the '/gallery' page.
//   console.log(`Loading: ${Math.round(loaded*100)}/${total*100}`);
// });

// pm.on('afterLoad', '/gallery', (next) => {
//   // Do something when images are done preloading in the '/gallery' page.
//   next();
// });

// Begin routing after all requirements are defined.
if (_.get($, 'webFont.typekit.id')) {
  try {
    Typekit.load({
      async: true,
      classes: false,
      active: pm.startRouting,
      inactive: pm.startRouting
    });
  }
  catch (err) {
    pm.startRouting();
  }
}
else {
  pm.startRouting();
}

console.log('Hello, world!');<% } else { %>
if (_.get($, 'webFont.typekit.id')) {
  try {
    Typekit.load({
      async: true,
      classes: false,
      active: init,
      inactive: init
    });
  }
  catch (err) {
    init();
  }
}
else {
  init();
}

function init() {
  console.log('Hello, world!');
}<% } %>
