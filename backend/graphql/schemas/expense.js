const { gql } = require('apollo-server-express')
 exports.expenseTypeDefs = gql`
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

  input ExpenseUpdateInput {
    id: ID!
    title: String
    price: Int
    description: String
    payee: UserInput!
    resolved: Boolean
    date: Date
    tags: [String!]
  }
  input ExpenseCreateInput {
    title: String!
    price: Int!
    description: String
    resolved: Boolean
    date: Date
    payee: UserInput!
    tags: [String!]
  }

  extend type Query {
    getExpenses(
      id: ID
      skip: Int
      limit: Int
      month: String
      year: String
      resolved: Boolean
    ): [Expense]
  }

  extend type Mutation {
    createExpenses(input: [ExpenseCreateInput]): [Expense]
    updateExpense(input: ExpenseUpdateInput): Expense
    deleteExpense(input: ID!): Expense
  }
`

