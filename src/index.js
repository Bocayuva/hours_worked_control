require('dotenv').config();
const http = require('http');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const bodyParserJsonError = require('express-body-parser-json-error');
const createGracefulShutdownMiddleware = require('express-graceful-shutdown');

const routeHandler = require('./commons/handler/route.handler');
const errorHandler = require('./commons/handler/error.handler');

const logger = require('./commons/logger/logger');
const moment = require('moment-timezone');

const app = express();
const server = http.createServer(app);

app.use(morgan(':method :url :status :response-time'));
app.use(createGracefulShutdownMiddleware(server, { forceTimeout: 30000 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParserJsonError());

const httpPort = process.env.HTTP_PORT;
const timezone = process.env.TIMEZONE;

moment.tz.setDefault(timezone);
moment.locale('pt');

logger.info('Starting BOT_WATSON server');
logger.info('Using timezone:', timezone);

(async () => {
  try {
    require('./api/routes')(app);
    app.use('/healthcheck', (req, res) => res.send('success'));
    app.use('*', routeHandler, errorHandler);
    server.listen(httpPort, () => logger.info('BOT_WATSON has started | port:', httpPort));
  } catch (error) {
    logger.error(error);
  }
})();
