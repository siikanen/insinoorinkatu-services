'use strict';
const { v4: uuidv4 } = require('uuid');
const models = require("../models") 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [{
      id: uuidv4(),
      name: "testCategory",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
