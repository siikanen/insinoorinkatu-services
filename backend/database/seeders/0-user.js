'use strict';
const { v4: uuidv4 } = require('uuid')



module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      username: "test",
      passwordhash: "test",
      salt: "test",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};


