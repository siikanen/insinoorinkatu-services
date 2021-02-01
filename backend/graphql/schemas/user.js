const { gql } = require('apollo-server-express')
 exports.userTypeDefs = gql`
  type User {
    id: ID!
    username: String
    createdAt: Date
    updatedAt: Date
  }
  input UserInput {
    id: ID!
    username: ID!
  }
  extend type Query {
    getUsers(id: ID): [User]
  }
`
