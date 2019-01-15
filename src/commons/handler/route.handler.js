'use strict';

const HttpError = require('../utils/http.error');
const { ROUTE_NOT_FOUND } = require('../constants/messages.constants');

module.exports = (req, res, next) => {
  if (req.baseUrl !== '/favicon.ico' && !res.headersSent) {
    return next(new HttpError(ROUTE_NOT_FOUND, 404));
  }
  next();
};
