const faker = require('faker')
const { User, Expense, Tag } = require('../database/models')
const randomUserAmount = 2
const randomExpenseAmount = 2
const randomTagAmount = 1

/**
 *
 * @param {Number} amount
 */
// eslint-disable-next-line
async function generateRandomExpenses(amount) {
  // TODO: Generate expenses for multiple users

  let newExpense
  let newTag
  let payee = await User.findOne({})
  for (let i = 0; i < amount; i++) {
    newExpense = await Expense.create({
      title: faker.commerce.productName(),
      amount: faker.random.number(),
      description: faker.commerce.productDescription(),
      date: new Date(),
    })
    for (let y = 0; y < randomTagAmount; y++) {
      newTag = await Tag.findOrCreate({
        where: {
          name: faker.random.word(),
        },
      })
      await newExpense.addTag(newTag[0])
    }
    await payee.addExpense(newExpense)
  }
}

async function generateRandomUsers(amount) {
  for (let i = 0; i < amount; i++) {
    await User.create({
      username: `test${i}`,
      password: 'test',
    })
  }
}
module.exports = {
  generateRandomExpenses,
  generateRandomUsers,
  randomExpenseAmount,
  randomTagAmount,
  randomUserAmount,
}
