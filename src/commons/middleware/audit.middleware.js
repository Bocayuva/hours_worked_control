'use strict';

const BaseController = require('../controllers/base.controller');

class AuditMiddleware extends BaseController {
  constructor() {
    super();
    this.auditLogger = require('../logger/logger.audit');
    this.process = this.process.bind(this);
  }

  process(req, res, next) {
    this.auditLogger.writeLog(req, res, next);
  }

  initialize() {
    return this.process;
  }
}

module.exports = new AuditMiddleware();
