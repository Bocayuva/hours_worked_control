'use strict';

class BaseLog {
  constructor() {
    this.moment = require('moment');
    this.duration = require('../utils/duration');
    this.logger = require('../utils/logger');
    this.msgerror = require('../constants/messageerror');
    let logPrefix = '';

    const getPrefix = () => {
      if (!logPrefix) {
        if (process.env.NODE_ENV === 'development') {
          const now = this.moment().format('DD/MM/YY HH:mm:ssSSS');
          logPrefix += `[${now}]`;
        }
        logPrefix += `[ETL][${this.constructor.name}]`;
      }
      return logPrefix;
    };

    const getMessage = (prefix, msg) => {
      return msg[0] === '[' ? `${prefix}${msg}` : `${prefix} ${msg}`;
    };

    this.log = {
      info: (msg, data) => this.logger.info(' ' + getMessage(getPrefix(), msg), data),
      debug: (msg, data) => this.logger.debug(getMessage(getPrefix(), msg), data),
      error: (msg, err) => this.logger.error(getMessage(getPrefix(), msg), err)
    };
  }
}

module.exports = BaseLog;
