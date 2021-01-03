'use strict'
const crypto = require('crypto')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Expense)
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        validate: {
          notNull: true,
        },
        defaultValue: DataTypes.UUIDV4,
        autoIncrement: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
        set() {
          // You are not supposed to set this manually, use the password field
        },
        get() {
          // Do not reveal passwordHash in the model attributes
        },
      },
      salt: {
        type: DataTypes.STRING,
        set() {
          // You are not supposed to set this manually, use the password field
        },
        get() {
          // Do not reveal passwordHash in the model attributes
        },
      },
      // NOTE: Password is virtual field for setting the hash and salt, it does not store the plaintext
      password: {
        type: DataTypes.VIRTUAL,
        set(password) {
          const newSalt = crypto.randomBytes(64).toString('hex')
          const newPasswordHash = crypto
            .scryptSync(password, newSalt, 64)
            .toString('hex')
          this.setDataValue('salt', newSalt)
          this.setDataValue('passwordHash', newPasswordHash)
        },
        get() {
          // You are supposed to check the hash using checkPassword()
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  )

  // TODO: Change this to input only the password to be checked.
  // Get other parameters internally
  User.prototype.checkPassword = (password, hash, salt) => {
    return crypto.scryptSync(password, salt, 64).toString('hex') === hash
  }

  return User
}
