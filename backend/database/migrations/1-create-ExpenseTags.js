module.exports = {
  up: (queryInterface, Sequelize) => {
    // Product belongsToMany Tag
    return queryInterface.createTable('ExpenseTags', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      ExpenseId: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      TagName: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    // remove table
    return queryInterface.dropTable('ExpenseTags')
  },
}
