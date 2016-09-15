<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
const $ = require('../config');
const _ = require('lodash');
const moment = require('moment');
const requireDir = require('require-dir');

/**
 * Resolves paths in view files. This method ensures that there are no
 * relative paths (by prefixing paths with '/' if needed) and resolves
 * fingerprinted paths.
 *
 * @param {string} p
 * @param {string} manifestPath
 *
 * @return {string}
 */
exports.getPath = function(p, manifestPath) {
  // Ensure there are no relative paths.
  let regex = /^(?!.*:\/\/)\w+.*$/g
  if (regex.test(p)) p = `/${p}`;

  try {
    let manifest = require(manifestPath);
    if (!manifest) return p;
    let r = manifest[p] || manifest[p.substr(1)];
    if (!r) return p;
    if (regex.test(r)) r = `/${r}`;
    return r;
  }
  catch (err) {
    return p;
  }
};

/**
 * Gets the path to the document under the given options.
 *
 * @param {Object} doc
 * @param {Object} options
 *
 * @return {string}
 */
exports.getDocumentPath = function(doc, options) {
  let pattern = _.get(options, `${doc.type}.permalink`);
  let ret = pattern;

  if (pattern) {
    const regex = /:(\w+)/g;
    let params = [];
    let m;
    while (m = regex.exec(pattern)) params.push(m[1]);

    for (let i = 0, key; key = params[i++];) {
      let val = doc[key];
      if (!val) return null;

      ret = ret.replace(`:${key}`, val);
    }

    return exports.getNormalizedPath(ret);
  }

  return null;
};

/**
 * Gets the pagination metadata with arguments provided.
 *
 * @param {string} collectionName
 * @param {Array} collection
 * @param {number} currentPage
 * @param {Object} options
 *
 * @return {Object}
 */
exports.getPaginationData = function(collectionName, collection, currentPage, options) {
  if (!collection.length) return undefined;

  const config = _.get(options, collection[0].type);
  const perPage = _.get(config, 'paginate.perPage');

  if (!config || isNaN(perPage)) return undefined;

  const chunks = _.chunk(collection, perPage);
  const pages = [];

  for (let i = 0; i < chunks.length; i++) {
    pages.push({
      path: (i === 0) ? `/${collectionName}/` : `/${collectionName}/${i+1}/`
    });
  }

  if (chunks.length >= currentPage) {
    return {
      files: chunks[currentPage-1],
      index: currentPage - 1,
      num: currentPage,
      pages: pages,
      next: (chunks.length > currentPage) && {
        path: `/${collectionName}/${currentPage+1}/`
      },
      previous: (currentPage > 1) && {
        path: ((currentPage - 1) === 1) ? `/${collectionName}/` : `/${collectionName}/${currentPage-1}/`
      }
    };
  }

  return undefined;
};
