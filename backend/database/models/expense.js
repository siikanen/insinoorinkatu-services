const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
//TODO: Replace date with created at timestamp?
const Expense = sequelize.define('Expense', {
  // Model attributes are defined here
  id:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.STRING,
    defaultValue :"test"
  },
  title: {
    type: DataTypes.STRING,
    defaultValue :"test"
  },
  description: {
    type: DataTypes.STRING,
    defaultValue :"test"
  },
  amount:{
    allowNull: false,
    type: DataTypes.FLOAT()
  },
  payee:{

    type: DataTypes.STRING,
    defaultValue :"test"
  },
  category:{

    type: DataTypes.STRING,
    defaultValue :"test"
  }
}, {
    timestamps: false
  // Other model options go here
});
// `sequelize.define` also returns the model
Expense.sync()
module.exports = Expense