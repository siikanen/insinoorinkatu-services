const express = require('express');
const path = require('path');
const logger = require('morgan');

const apiRouterv1 = require('./routes/v1/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouterv1)

module.exports = app;
