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
      type:DataTypes.UUIDV4,
      validate:{
        notNull: true
      }
    },
    title: DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'expense',
  });
  return expense;
};