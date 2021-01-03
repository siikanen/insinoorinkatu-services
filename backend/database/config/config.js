module.exports = {
  development: {
    database: 'database_development',
    dialect: 'sqlite',
    storage:'develop.sqlite',
    transactionType: 'IMMEDIATE'
  },
  staging: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: process.env.CI_DB_HOSTNAME,
    dialect: 'mysql',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    //Disable logging to make it easier to read test results
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: 'mysql'
  }
}
