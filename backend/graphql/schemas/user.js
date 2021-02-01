const {gql} = require('apollo-server-express')
const userTypeDefs = gql`
type User {
  id: String!
  username: String!

}

`
module.exports= userTypeDefs
