const { ApolloServer } = require('apollo-server-express')
const { typeDefs } = require('./graphql/schemas/index')
const { resolvers } = require('./graphql/resolvers/index')
const express = require('express')

require('express-async-errors')
const cors = require('cors')
const path = require('path')
const logger = require('morgan')

const errorHandler = require('./utils/errors/handler')
const apiRouterv1 = require('./routes/v1/api')

const { NotFoundError } = require('./utils/errors/userfacing')

const server = new ApolloServer({
  typeDefs,
  resolvers
})
const app = express()
server.applyMiddleware({ app })
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', apiRouterv1)

app.use(async () => {
  throw new NotFoundError('Invalid path or method')
})

app.use(errorHandler)
module.exports = app
