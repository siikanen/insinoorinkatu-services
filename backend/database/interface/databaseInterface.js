const { Sequelize, Op, Model, DataTypes } = require("sequelize");

/**
 * Establish a connection to the database
 * Returns a connection object
 */
async function connectDatabase(){
    const sequelize = new Sequelize('sqlite::memory:') //TODO: Set custom logger here!
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    return sequelize

}
/**
 * Closes a database connection
 * @param {*} database   - the database connection to close
 */
async function disconnectDatabase(database){
    try{
        console.log("disconnected")
        database.close()
    }
    catch(err){
        console.log(err)
    }
}


module.exports  = {connectDatabase,disconnectDatabase}