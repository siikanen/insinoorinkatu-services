'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Expense, { through: 'ExpenseTags' })
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          len: {
            args: [1,255],
            msg: 'Tag name must be between 1 and 255 characters'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Tag',
      timestamps: false
    }
  )
  return Tag
}
