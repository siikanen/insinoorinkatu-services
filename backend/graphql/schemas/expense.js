const { gql } = require('apollo-server-express')
const expenseTypeDefs = gql`
  scalar Date

  type Expense {
    id: ID!
    title: String!
    description: String
    price: Int!
    resolved: Boolean!
    date: Date!
    payee: User
    tags: [Tag]
  }
  input ExpenseInput {
    title: String!
    description: String
    price: Int!
    resolved: Boolean
    date: Date
    payee: PayeeInput!
    tags: [String!]
  }

  extend type Query {
    getExpenses(
      id: ID
      skip: Int
      limit: Int
      month: String
      year: String
    ): [Expense]
  }

  extend type Mutation {
    createExpenses(input: [ExpenseInput]): [Expense]
  }
`
module.exports = expenseTypeDefs
