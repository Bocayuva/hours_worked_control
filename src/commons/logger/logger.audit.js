'use strict';

const BaseController = require('../controllers/base.controller');
const systemActions = require('../constants/systemactions.constants');
const systemFunctionality = require('../constants/systemfunctionality.constants');

class AuditLogger extends BaseController {
  constructor() {
    super();
    this.Audit = require('../../models/audit.model');
  }

  getAction(req) {
    const { method } = req;
    let action;
    switch (method) {
      case 'POST':
        action = systemActions.CRIAR;
        break;
      case 'PUT':
        action = systemActions.EDITAR;
        break;
      case 'DELETE':
        action = systemActions.EXCLUIR;
        break;
    }
    return action;
  }

  getObject(req) {
    const { body, method, params } = req;
    if (method === 'PUT' || method === 'DELETE') {
      body.id = params.id;
    }
    return body;
  }

  getMessage(res) {
    const status = res.statusCode === 200 ? 'sucesso' : 'erro';
    return `Solicitação efetuada com ${status}.`;
  }

  async writeLog(req, res, next) {
    const { originalUrl } = req;
    let log;

    if (originalUrl.indexOf('/api/message') > -1) {
      const SystemAction = this.getAction(req);
      if (SystemAction) {
        log = new this.Audit({
          SystemAction,
          SystemFunctionality: systemFunctionality.MODELO_MENSAGEM,
          CreatedBy: req.token.user,
          Message: this.getMessage(res),
          Object: this.getObject(req)
        });
      }
    } else if (originalUrl.indexOf('/api/sendmessagetime') > -1) {
      if (req.method === 'POST') {
        log = new this.Audit({
          SystemAction: res._headers.action === 'create' ? systemActions.CRIAR : systemActions.EDITAR,
          SystemFunctionality: systemFunctionality.MODELO_MENSAGEM,
          CreatedBy: req.token.user,
          Message: this.getMessage(res),
          Object: this.getObject(req)
        });
      }
    } else if (originalUrl.indexOf('/api/dispatchrule') > -1) {
      const SystemAction = this.getAction(req);
      if (SystemAction) {
        log = new this.Audit({
          SystemAction,
          SystemFunctionality: systemFunctionality.REGRA_COMUNICACAO,
          CreatedBy: req.token.user,
          Message: this.getMessage(res),
          Object: this.getObject(req)
        });
      }
    }

    if (log) {
      await log.save();
    }
    next();
  }
}

module.exports = new AuditLogger();
