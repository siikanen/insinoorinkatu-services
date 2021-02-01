const { gql } = require('apollo-server-express')
exports.tagTypeDefs = gql`
  type Tag {
    name: String!
  }

  input TagInput{
    name: String!
  }
`

