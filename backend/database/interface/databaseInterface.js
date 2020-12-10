const { Sequelize, Op, Model, DataTypes } = require("sequelize");


const connectDatabase = async()=>{
    const sequelize = new Sequelize('sqlite::memory:') //TODO: Set custom logger here!
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    return sequelize

}
const disconnectDatabase = async(database) =>{
    try{
        console.log("disconnected")
        database.close()
    }
    catch(err){
        console.log(err)
    }
}


module.exports  = {connectDatabase,disconnectDatabase}