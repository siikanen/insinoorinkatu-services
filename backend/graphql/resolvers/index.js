const { GraphQLDateTime } = require('graphql-iso-date')
const expenseResolvers = require('./expense')
var _ = require('lodash')


const resolvers = _.merge({}, expenseResolvers, { Date: GraphQLDateTime })

module.exports = resolvers
