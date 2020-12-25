const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const config = require("../config/config");
/**
 * Establish a connection to the database
 * Returns a connection object
 */
function connect() {
  const sequelize = new Sequelize(
    (() => {
      switch (process.env.NODE_ENV) {
        case "dev":
          return config.development;
        case "staging":
          return config.staging;
        case "production":
          return config.production;
        default:
          return config.development;
      }
    })()
  ); //TODO: Set custom logger here!
  try {
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  return sequelize;
}
/**
 * Closes a database connection
 * @param {*} database   - the database connection to close
 */
function disconnect(database) {
  try {
    console.log("disconnected");
    database.close();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { connect, disconnect};
