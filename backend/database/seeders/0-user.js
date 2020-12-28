'use strict'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = []
    users.push({
      id: uuidv4(),
      username: 'test',
      //password = test
      passwordhash: 'bf9eb29a3ff189db9cd001821fb1a6ee934600a2a8d961a05438edba0ea1672bac0030117c66d2b6d29fd7c622ea576e959ef539eb2ca1a62afe122a90df425b',
      salt: '643e8caa59b0dc9f8cb1e3eb1429fabeb24b472593a0fa4d2c4bf1f8c69c3957c44c8940960d00144eabf72d9b8c732cca264c7a4cc0d40ccdbddbd8eba2a0e5',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return queryInterface.bulkInsert('Users',users)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  },
}
