const express = require('express')
require('express-async-errors')
const path = require('path')
const logger = require('morgan')

const errorHandler = require('./utils/errors/handler')
const apiRouterv1 = require('./routes/v1/api')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', apiRouterv1)

app.use(errorHandler)

module.exports = app
