const { gql } = require('apollo-server-express')
const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  input PayeeInput {
    id: ID!
  }
`
module.exports = userTypeDefs
