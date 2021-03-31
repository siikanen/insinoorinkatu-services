'use strict'
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const passwordValidator = require('password-validator')
const { Model, ValidationError } = require('sequelize')
const { UserValidationError } = require('../../utils/errors/userfacing')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Class Methods
    // These will be callable within the class

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Expense)
    }

    // Instance Methods
    // These will be callable for each model intance

    /**
     * Set user password hash and generate new salt
     * Creates new salt and hash from new password string given
     * @param {string} password Password to be hashed
     */
    async setPasswordHash(password) {
      return new Promise((resolve, reject) => {
        // Generate new salt every time password is being set
        this.setDataValue('salt', crypto.randomBytes(64).toString('hex'))

        crypto.scrypt(password, this.getDataValue('salt'), 64, (err, hash) => {
          if (err) return reject(err)
          this.setDataValue('passwordHash', hash.toString('hex'))
          resolve()
        })
      })
    }

    /**
     * Validate user password complexity to pass minimum level
     * @param {string} password Password to validate
     */
    async validatePassword(password) {
      return new Promise((resolve, reject) => {
        if (typeof password !== 'string')
          reject(new UserValidationError('Please enter password'))

        const schema = new passwordValidator()
        schema
          .is()
          .min(8) // Minimum length 8
          .is()
          .max(100) // Maximum length 100
          .has()
          .uppercase() // Must have uppercase letters
          .has()
          .lowercase() // Must have lowercase letters
          .has()
          .digits(2)
        // Schema returns list of rules that fail
        const failedRules = schema.validate(password, { list: true })
        if (failedRules.length === 0) resolve()
        else
          return reject(
            new UserValidationError(
              'Password does not meet the required complexity.',
              { failedRules }
            )
          )
      })
    }
    /**
     * Use for validating the user password, for ex. logging in
     * @param {string} password to test against
     * @returns {boolean} wheter password was correct or not
     */
    async checkPassword(password) {
      return new Promise((resolve, reject) => {
        crypto.scrypt(password, this.getDataValue('salt'), 64, (err, hash) => {
          if (err) reject(err)
          else
            return resolve(
              hash.toString('hex') === this.getDataValue('passwordHash')
            )
        })
      })
    }

    async createToken() {
      return new Promise((resolve, reject) => {
        const tokenContent = {
          username: this.username,
          id: this.id
        }
        const jwtOptions = {
          algorithm: 'HS256',
          expiresIn: '24h'
        }
        jwt.sign(
          tokenContent,
          process.env.JWT_SECRET,
          jwtOptions, (err, token) => {
            !err ? resolve(token) : reject(err)
          }
        )
      })
    }
  }

  User.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          isUUID: 4,
          notNull: true
        }
      },
      username: {
        type: DataTypes.STRING,
        unique: {
          msg: 'Username already taken, please choose different one.'
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter username'
          },
          len: {
            args: [3, 50],
            msg:
              'Invalid username length. Please choose one between 3-50 characters'
          }
        }
      },

      /*
       * Passwordhash and salt are being handled by the setPasswordHash
       * and checkPassword methods. We also never want to display them so
       * so getters are set to return nothing
       */
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        set() {},
        get() {},
        validate: {
          checkPasswordHash() {
            if (this.getDataValue('passwordHash').length !== 128)
              throw new ValidationError('Password must be set')
          }
        }
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
        set() {},
        get() {},
        validate: {
          checkSalt() {
            if (this.getDataValue('salt').length !== 128)
              throw new ValidationError('Password must be set')
          }
        }
      },
      password: {
        type: DataTypes.VIRTUAL,
        set(password) {
          // NOTE: beforeValidate hook will check this value and hash it
          // plaintext will not be stored
          this.passwordToHash = password
        },
        get() {}
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )

  // This hooks checks if password for this model has been changed
  // and hashes it
  User.addHook('beforeValidate', async (user, options) => {
    // If user is new, we do not yet have password, so we must force
    // user to set one
    if (user.passwordToHash || user.isNewRecord) {
      await user.validatePassword(user.passwordToHash)
      await user.setPasswordHash(user.passwordToHash)

      // Remove plaintext password from memory after it has been hashed
      delete user.passwordToHash

      // We have to inform Sequelize that hash and salt has been changed,
      // and should be updated in database. Otherwise these fields won't be saved
      options.fields.push('passwordHash')
      options.fields.push('salt')
      options.skip.filter((value) => {
        value === 'passwordHash' || value === 'salt' ? false : true
      })
    }
  })
  return User
}
