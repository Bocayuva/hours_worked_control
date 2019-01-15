'use strict';

class RepliesHandler {
  constructor() {
    this.moment = require('moment');
    this.logger = require('../../commons/logger/logger');
    this.Context = require('../../models/context.model');
    this.MessageModel = require('../../models/message.model');
    this.Contact = require('../../models/contact.model');
    this.BufferUtils = require('../../commons/utils/buffer.utils');
    this.ValidationUtils = require('../utils/validation.utils');
    this.ConnectionFactory = require('../../commons/utils/amqp.connectionFactory');
    this.ContextStatus = require('../../commons/constants/contextstatus.constants');
    this.MessageStatus = require('../../commons/constants/messagestatus.constants');
    this.foundContext = false;
  }

  log(msg) {
    let logPrefix = '';
    if (process.env.NODE_ENV === 'development') {
      const now = this.moment().format('DD/MM/YY HH:mm:ssSSS');
      logPrefix += `[${now}]`;
    }
    logPrefix += `[${this.constructor.name}][${this.replyContext.contact}]`;
    if (msg instanceof Error) {
      this.logger.error(logPrefix, msg);
    } else {
      this.logger.info(logPrefix, msg);
    }
  }

  async _getContextByContact() {
    const result = this.ValidationUtils.normalizePhone(this.replyContext.contact);
    if (!result.isValid) throw new Error('Invalid phone');
    this.replyContext.contact = result.phone;
    this.replyContext.message = this.ValidationUtils.normalizeReturnCode(this.replyContext.message);
    this.log(`Starting to process reply message "${this.replyContext.message}"`);
    this.replyContext.Context = await this.Context
      .findOne({
        'Data.Content.Messages.Contact': this.replyContext.contact,
        'Data.Content.Messages.Status': this.MessageStatus.WAITINGREPLY,
        'Data.Content.Status': this.ContextStatus.WAITINGMESSAGESPROCESS
      })
      .populate({
        path: 'Data.Content.Messages.MessageModel',
        populate: { path: 'ReturnActions.ActionType' }
      });

    if (this.replyContext.Context) {
      const { Messages } = this.replyContext.Context.Data.Content;
      this.replyContext.reply = Messages[Messages.length - 1];
      this.foundContext = this.replyContext.reply.Status === this.MessageStatus.WAITINGREPLY;
      if (this.foundContext && this.replyContext.reply.MessageReturnCodes.indexOf(this.replyContext.message) > -1) {
        this.log(`Found message context with AdccId "${this.replyContext.Context.Data.Header.AdccId}"`);
        this.replyContext.reply.Status = this.MessageStatus.REPLIED;
        this.replyContext.reply.Answer = this.replyContext.message;
        this.replyContext.reply.ShipmentsTime[this.replyContext.reply.ShipmentsTime.length - 1].ReceivedTime = Date.now();
        await this.replyContext.Context.save();
      } else {
        throw new Error(`Couldn't found any message waiting reply with return code "${this.replyContext.message}".`);
      }
    } else {
      throw new Error(`Couldn't found any message waiting reply with return code "${this.replyContext.message}".`);
    }
  }

  async _publish() {
    const index = this.replyContext.reply.MessageReturnCodes.indexOf(this.replyContext.message);
    const returnAction = this.replyContext.reply.MessageModel.ReturnActions[index];
    const countActions = this.replyContext.reply.MessageModel.ReturnActions.filter(e => !e.ReturnCode);
    if (countActions.length) {
      const contactReturn = await this.Contact.findById(this.replyContext.contact);
      if (contactReturn.ExpiredCount + countActions.length === contactReturn.Count) {
        this.log('Reseting the contact return count.');
        contactReturn.Count = 0;
        contactReturn.ExpiredCount = 0;
      } else {
        contactReturn.ExpiredCount += countActions.length;
        this.log(`Contact return count still expecting ${contactReturn.Count - contactReturn.ExpiredCount} response(s).`);
      }
      await contactReturn.save();
    }
    const { Action } = returnAction.ActionType;
    if (Action) {
      if (returnAction.ReplyMessageModel) {
        this.replyContext.Context.Data.Content.Messages.push({
          MessageModel: returnAction.ReplyMessageModel,
          Status: this.MessageStatus.CREATED,
          CurrentTypeIndex: this.replyContext.reply.CurrentTypeIndex
        });
      } else {
        const { Content } = this.replyContext.Context;
        if (!Content.Actions) Content.Actions = [];
        Content.Actions.push(Action);
        this.replyContext.Context.markModified('Content');
      }
      this.log(`Saving context with status "${this.replyContext.Context.Data.Content.Status}"`);
      await this.replyContext.Context.save();
      const channel = await this.ConnectionFactory.getChannel();
      await channel.assertQueue(Action.Queue);
      this.log(`Publishing to queue "${Action.Queue}"...`);
      channel.sendToQueue(Action.Queue, this.BufferUtils.StringToBuffer(this.replyContext.Context.Data.Header.AdccId), { persistent: true });
    } else {
      this.log('Return action not found. Closing the context...');
      this.replyContext.Context.Data.Content.Status = this.ContextStatus.CLOSED;
      await this.replyContext.Context.save();
    }
  }

  async process(args) {
    const result = {
      success: true,
      message: 'Mensagem recebida com sucesso'
    };
    try {
      if (!args.contact || !args.message) throw new Error(`Expecting values for contact and message. Got args.contact: "${args.contact}" | args.message: "${args.message}"`);
      this.replyContext = args;
      await this._getContextByContact();
      await this._publish();
      if (args.isBot) {
        result.status = this.replyContext.Context.Data.Content.Status;
        result.adccId = this.replyContext.Context.Data.Header.AdccId;
      }
    } catch (error) {
      this.log(error);
      result.success = false;
      result.message = error.message;
    }
    result.foundContext = this.foundContext;
    return result;
  }
}

module.exports = RepliesHandler;
