'use strict';

module.exports = {
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_VALUE: 'INVALID_VALUE',
  INVALID_CRITERIA: 'INVALID_CRITERIA',
  INVALID_REQUEST: 'INVALID_REQUEST',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',

  INPUT_RECEIVED_SUCCESS: 'INPUT_RECEIVED_SUCCESS',

  SECRET_BA_EXPIRED: 'SECRET_BA_EXPIRED',
  JMS_FEEDBACK_ERROR: 'ERROR_ON_SEND',
  JMS_SERVICE_ERROR: 'JMS_SERVICE_ERROR',
  JMS_SERVICE_NOT_FOUND: 'WSDL_NOT_FOUND',
  JMS_TIME_OUT_ERROR: 'JMS_TIME_OUT_ERROR',
  SERVICE_COMM_ERROR: 'SERVICE_COMM_ERROR',

  SOAP_ERROR_ON_CREATE: 'SOAP_ERROR_ON_CREATE',
  SOAP_ERROR_ON_APPROVE: 'SOAP_ERROR_ON_APPROVE',
  SOAP_CONN_REFUSED: 'SOAP_CONN_REFUSED',

  RULE_CREATE_SUCCESS: 'RULE_CREATE_OK',
  RULE_CREATE_ERROR: 'RULE_CREATE_NOK',
  RULE_UPDATE_SUCCESS: 'RULE_UPDATE_OK',
  RULE_UPDATE_ERROR: 'RULE_UPDATE_NOK',
  RULE_DELETE_SUCCESS: 'RULE_DELETE_OK',
  RULE_DELETE_ERROR: 'RULE_DELETE_NOK',
  RULE_NOT_FOUND: 'RULE_NOT_FOUND',

  REF_DATA_NOT_FOUND: 'REF_DATA_NOT_FOUND',

  MESSAGE_CREATE_SUCCESS: 'MESSAGE_CREATE_OK',
  MESSAGE_CREATE_ERROR: 'MESSAGE_CREATE_NOK',
  MESSAGE_UPDATE_SUCCESS: 'MESSAGE_UPDATE_OK',
  MESSAGE_UPDATE_ERROR: 'MESSAGE_UPDATE_NOK',
  MESSAGE_DELETE_SUCCESS: 'MESSAGE_DELETE_OK',
  MESSAGE_DELETE_ERROR: 'MESSAGE_DELETE_NOK',
  MESSAGE_DELETE_RULE_ASSOCIATED_ERROR: 'MESSAGE_DELETE_RULE_ASSOCIATED_NOK',
  MESSAGE_DELETE_CONTEXT_ASSOCIATED_ERROR: 'MESSAGE_DELETE_CONTEXT_ASSOCIATED_NOK',
  MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
  MESSAGE_SEND_SUCCESS: 'MESSAGE_SEND_OK',
  MESSAGE_SEND_ERROR: 'MESSAGE_SEND_NOK',

  MESSAGE_SEND_TIME_CREATE_SUCCESS: 'MESSAGE_SEND_TIME_CREATE_OK',
  MESSAGE_SEND_TIME_CREATE_ERROR: 'MESSAGE_SEND_TIME_CREATE_NOK',
  MESSAGE_SEND_TIME_UPDATE_SUCCESS: 'MESSAGE_SEND_TIME_UPDATE_OK',
  MESSAGE_SEND_TIME_UPDATE_ERROR: 'MESSAGE_SEND_TIME_UPDATE_NOK',

  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_LOGIN_ERROR: 'INVALID_USER_OR_PASS',
  USER_LOGIN_SUCCESS: 'LOGIN_SUCCESS',

  MESSENGER_EVENT_RECEIVED: 'EVENT_RECEIVED'
};
