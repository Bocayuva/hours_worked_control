'use strict';

const Promise = require('bluebird');

module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};
