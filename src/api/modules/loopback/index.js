'use strict';

const BaseRouter = require('../../../commons/router/base.router');
const Promise = require('bluebird');

class LoopbackRouter extends BaseRouter {
  initialize() {
    this.get('/test', (req, res) => res.json({ status: 'OK' }));
    this.get('/delay/:secs', async (req, res) => {
      const delay = secs => {
        return new Promise(resolve => setTimeout(() => resolve({ delay: secs }), secs * 1000));
      };
      const result = await delay(req.params.secs);
      res.json(result);
    });
  }
}

module.exports = new LoopbackRouter().getRouter();
