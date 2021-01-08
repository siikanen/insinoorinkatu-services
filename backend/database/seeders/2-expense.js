'use strict'
const { v4: uuidv4 } = require('uuid')
const User = require('../models').User
const faker = require('faker')
//TODO: remove random data from seeds, replace with static test data
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let expenses = []
    const users = await User.findAll()
    for (let i = 0; i < 10; i++) {
      expenses.push({
        id: uuidv4(),
        title: faker.commerce.productName(),
        price: faker.random.number(),
        description: faker.commerce.productDescription(),
        date: new Date(),
        UserId: ((userList) => {
          const randomIndex = Math.floor(Math.random() * (userList.length - 1 ))
          return userList[randomIndex].id
        })(users),
        resolved: ((i = Math.random()) => i >= 0.5 )(),
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
