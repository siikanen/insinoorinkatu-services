"use strict";
const crypto = require("crypto");
const { Model } = require("sequelize");
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
  }
  User.init(
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
      username: DataTypes.STRING,
      passwordhash: {
        type: DataTypes.STRING,
        set(value) {
          //Do nothing
          //TODO: Throw error, You are not supposed to modify hash directly
        },
      },
      salt: {
        type: DataTypes.STRING,
        set(value) {
          //Do nothing
          //TODO: Throw error, You are not supposed to modify salt directly
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.prototype.setPassword = (password) => {
    const newSalt = crypto.randomBytes(32).toString("hex");
    const newpasswordHash = crypto
      .scryptSync(password, newSalt, 64)
      .toString("hex");
    this.salt = newSalt;
    this.passwordHash = newpasswordHash;
  };
  return User;
};
