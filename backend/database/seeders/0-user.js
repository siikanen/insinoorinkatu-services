"use strict";
const { v4: uuidv4 } = require("uuid");
const faker = require('faker')
module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = []
    for (let i = 0; i < 5; i++) {
      users.push({
        id: uuidv4(),
        username: faker.name.lastName(),
        passwordhash: "replaceMeWithPasswordHash",
        salt: "replaceMeWithRandomSalt",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert("Users",users)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
