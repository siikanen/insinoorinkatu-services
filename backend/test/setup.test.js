
const {connectDatabase,disconnectDatabase} = require('../database/interface/databaseInterface') 
let databaseconnection
/**
 * Run before all tests
 */
const beforeAll = async () => {
  databaseconnection=await connectDatabase()


}

/**
 * Run after all tests
 */
const afterAll = done => {
  disconnectDatabase(databaseconnection)
  done()
}

module.exports.mochaHooks = { beforeAll, afterAll }