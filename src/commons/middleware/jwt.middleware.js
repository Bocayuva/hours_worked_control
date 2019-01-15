'use strict';

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const HttpController = require('../controllers/http.controller');

class JwtMiddleware extends HttpController {
  constructor() {
    super();
    this.secret = process.env.JWT_SECRET;
    this.process = this.process.bind(this);
  }

  _getTokenFromHeader(req) {
    const { authorization } = req.headers;
    return authorization ? authorization.split(/(\s+)/)[2] : '';
  }

  async process(req, res, next) {
    const { originalUrl } = req;
    let token;

    try {
      if (originalUrl === '/favicon.ico' ||
        originalUrl.indexOf('healthcheck') > -1 ||
        originalUrl.indexOf('/api/webhook') > -1 ||
        originalUrl.indexOf('/api/oi') > -1 ||
        originalUrl === '/api/user' ||
        originalUrl.indexOf('/api/user/login') > -1 ||
        originalUrl.indexOf('/api/reply') > -1 ||
        originalUrl.indexOf('/api/loopback') > -1) {
        next();
      } else {
        token = this._getTokenFromHeader(req);
        const jwtVerifyAsync = Promise.promisify(jwt.verify, { context: jwt });
        req.token = await jwtVerifyAsync(token, this.secret);
        next();
      }
    } catch (err) {
      next(new this.HttpError(this.messages.TOKEN_EXPIRED, 400, { token, error: err.message }));
    }
  }

  initialize() {
    return this.process;
  }
}

module.exports = new JwtMiddleware();
