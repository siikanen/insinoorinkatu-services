const { gql } = require('apollo-server-express')
const tagTypeDefs = gql`
  type Tag {
    name: String!
  }
`
module.exports = tagTypeDefs
