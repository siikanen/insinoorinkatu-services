'use strict'
const { Model, ValidationError } = require('sequelize')
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

      // Scopes
      this.addScope('defaultScope', {
        attributes: {
          // This field is used to link tables,
          // it is referred as payee below
          exclude: ['UserId']
        },
        include: [
          {
            model: models.User,
            as: 'payee',
            attributes: ['id', 'username']
          },
          {
            model: models.Tag,
            as: 'tags',
            attributes: ['name'],
            through: {
              attributes: []
            }
          }
        ]
      })
    }
  }
  expense.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          notNull: true,
          isUUID: 4
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1, 69],
            msg: 'Title must be between 1 and 69 characters'
          },
          notNull: {
            msg: 'Please enter title'
          }
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [5, 2500],
            msg: 'Description must be 5-2500 characters'
          },
          min: {
            args: [10],
            msg: 'Please be a little bit more precise :)'
          },
          max: {
            args: [1500],
            msg: 'Description must be under 1500 characters'
          }
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter price'
          },
          isInt: {
            msg: 'Price must be integer, convert euros to cents'
          },
          min: {
            args: [0],
            msg: 'Price must be greater than 0'
          },
          max: {
            args: [100000000],
            msg: 'Price must be less than one million'
          },
        }
      },
      resolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
          isBoolean(value) {
            if (typeof value !== 'boolean')
              throw new ValidationError('Resolved must be boolean')
          },
          notNull: {
            msg: 'Resolved cannot be null'
          }
        }
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'Please provide date that follows ISO8601'
          },
          notNull: {
            msg: 'Date cannot be empty'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Expense'
    }
  )
  return expense
}
