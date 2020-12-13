"use strict";
const { v4: uuidv4 } = require("uuid");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let categories = [];
    for (let i = 0; i < 5; i++) {
      categories.push({
        id: uuidv4(),
        name: faker.commerce.department(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert("Categories", categories);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
