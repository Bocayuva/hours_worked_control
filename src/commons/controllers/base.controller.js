'use strict';

class BaseController {
  constructor() {
    this.moment = require('moment');
    this.logger = require('../logger/logger');
  }
}

module.exports = BaseController;
