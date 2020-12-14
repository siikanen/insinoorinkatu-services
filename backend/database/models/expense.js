'use strict';
const {
  Model
} = require('sequelize');
const { validate } = require('webpack');
module.exports = (sequelize, DataTypes) => {
  class expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  expense.init({
    id:{
      primaryKey:true,
      allowNull: false,
      type:DataTypes.UUID,
      validate:{
        notNull: true
      },
     defaultValue: DataTypes.UUIDV4,
     autoIncrement: false 
    },
    title: DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return expense;
};