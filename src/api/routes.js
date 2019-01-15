'use strict';

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).filter(name => isDirectory(join(source, name)));

module.exports = app => getDirectories(join(__dirname, 'modules')).forEach(route => app.use(`/api/${route}`, require(`./modules/${route}`)));
