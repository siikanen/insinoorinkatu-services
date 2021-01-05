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

    /**
     * Use for validating the user password, for ex. logging in
     * @param {string} password to test against
     * @returns {boolean} wheter password was correct or not
     */
    checkPassword(password) {
      return (
        crypto
          .scryptSync(password, this.getDataValue('salt'), 64)
          .toString('hex') === this.getDataValue('passwordHash')
      )
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
          notNull: true
        },
        defaultValue: DataTypes.UUIDV4,
        autoIncrement: false
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        set() {
          // You are not supposed to set this manually, use the password field
        },
        get() {
          // Do not reveal passwordHash in the model attributes
        }
      },
      salt: {
        type: DataTypes.STRING,
        set() {
          // You are not supposed to set this manually, use the password field
        },
        get() {
          // Do not reveal passwordHash in the model attributes
        }
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
        }
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )
  return User
}
