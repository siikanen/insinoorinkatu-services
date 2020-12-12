'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
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
    username: DataTypes.STRING,
    passwordhash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};