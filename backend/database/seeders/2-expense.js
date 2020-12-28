'use strict'
const { v4: uuidv4 } = require('uuid')
const models = require('../models')
const faker = require('faker')
//TODO: remove random data from seeds, replace with static test data
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let expenses = []
    const userModel = models.User
    const user = await userModel.findOne()
    for (let i = 0; i < 5; i++) {
      expenses.push({
        id: uuidv4(),
        title: faker.commerce.productName(),
        amount: faker.random.number(),
        userID: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('Expenses', expenses)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Expenses', null, {})
  },
}
