const { gql } = require('apollo-server-express')
const expenseTypeDefs = require('./expense')
const userTypeDefs = require('./user')
const tagTypeDefs = require('./tag')

const baseTypeDefs = gql`
  type Query
  type Mutation
`
const typeDefs = [baseTypeDefs, userTypeDefs, expenseTypeDefs, tagTypeDefs]
module.exports = typeDefs
