const faker = require('faker')
const { User, Expense, Tag } = require('../database/models')
const randomUserAmount = 2
const randomExpenseAmount = 2
const randomTagAmount = 1
const testUserPassword = "testMeWhyDontYou69"
const expenseFields = [
  'id',
  'createdAt',
  'updatedAt',
  'title',
  'description',
  'price',
  'resolved',
  'date',
  'payee',
  'tags']
const userFields = [
  'id',
  'username',
  'createdAt',
  'updatedAt'
]
const testExpenseTemplate = {
  data: [
    {
      title: 'testTitle',
      description: 'testDescription',
      price: 1000,
      date: new Date(),
      // Dynamically need to add payee here in order to get ID
      tags: ['testTag1', 'testTag2']
    }
  ]
}
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
      price: faker.datatype.number(),
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
      password: testUserPassword
    })
  }
}
module.exports = {
  generateRandomExpenses,
  generateRandomUsers,
  testUserPassword,
  randomExpenseAmount,
  randomTagAmount,
  expenseFields,
  userFields,
  randomUserAmount,
  testExpenseTemplate
}
