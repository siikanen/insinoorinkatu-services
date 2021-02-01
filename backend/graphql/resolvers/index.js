const { GraphQLDateTime } = require('graphql-iso-date')
const expenseResolvers = require('./expense')
const _ = require('lodash')


const resolvers = _.merge({}, expenseResolvers, { Date: GraphQLDateTime })

module.exports = resolvers
