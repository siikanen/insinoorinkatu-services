'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tags', {
      name: {
        primaryKey: true,
        type: Sequelize.STRING,
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tags')
  },
}
