const { GraphQLDateTime } = require('graphql-iso-date')
const { expenseResolvers } = require('./expense')
const _ = require('lodash')
const { userResolvers } = require('./user')

exports.resolvers = _.merge({}, expenseResolvers, userResolvers, {
  Date: GraphQLDateTime
})
