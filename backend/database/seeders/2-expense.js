'use strict';
const { v4: uuidv4 } = require('uuid');
const models = require("../models") 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userModel = models.User
    const user = await userModel.findOne()
    return queryInterface.bulkInsert('Expenses', [{
      id: uuidv4(),
      title: "test",
      amount: 2,
      userID: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Expenses', null, {});
  }
};
