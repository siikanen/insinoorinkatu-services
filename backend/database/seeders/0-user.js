"use strict";
const { v4: uuidv4 } = require("uuid");
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = []
      users.push({
        id: uuidv4(),
        username: "test",
        //password = test
        passwordhash: "2182202d89add441ac1918e775874e16f4a49bf2b42ffd2c191288d8007020187d16cf3187174c78631fab4af85951d0b50f1fb51f08b0600dcca4d7e029308e",
        salt: "a75af2320cd2147b9b300e077abd6022d3ebe3937ace8c41cd319946d5d30f31",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    
    return queryInterface.bulkInsert("Users",users)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
