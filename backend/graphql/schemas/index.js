const { gql } = require('apollo-server-express')
const { expenseTypeDefs } = require('./expense')
const { userTypeDefs } = require('./user')
const { tagTypeDefs } = require('./tag')

const baseTypeDefs = gql`
  type Query
  type Mutation
`
exports.typeDefs = [baseTypeDefs, userTypeDefs, expenseTypeDefs, tagTypeDefs]
