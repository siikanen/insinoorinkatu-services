'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { as: 'payee', foreignKey: 'UserId' })
      this.belongsToMany(models.Tag, { as: 'tags', through: 'ExpenseTags' })
    }
  }
  expense.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        validate: {
          notNull: true,
        },
        defaultValue: DataTypes.UUIDV4,
        autoIncrement: false,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      date: DataTypes.DATE,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Expense',
    }
  )
  return expense
}
