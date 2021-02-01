const { gql } = require('apollo-server-express')
const expenseTypeDefs = gql`
  scalar Date

  type Expense {
    id: String!
    title: String!
    description: String
    price: Int!
    resolved: Boolean!
    date: Date!
    payee: User
    tags: [Tag]

  }

  extend type Query {
    getExpenses(
      id: String
      skip: Int
      limit: Int
      month: String
      year: String
    ): [Expense]
  }
`
module.exports = expenseTypeDefs
