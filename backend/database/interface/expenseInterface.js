const { NotFoundError } = require('../../utils/errors/userfacing')
const { User, Expense, Tag } = require('../models')

/**
 * Fetch all expenses matching filter as json
 *
 */
async function getExpenses(filter = {}) {
  let expenses = await Expense.findAll({
    where: filter,
    attributes: {
      exclude: ['UserId']
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: User,
        as: 'payee',
        attributes: ['id', 'username']
      }
    ]
  })
  if (expenses.length === 0) throw new NotFoundError('Expense not found')
  // Transform to objects
  expenses = expenses.map((expense) => expense.get())
  // Remap tag objects to strings
  expenses = expenses.map((expense) => {
    expense.tags = expense.tags.map((tag) => tag.name)
    return expense
  })
  return expenses
}

/** Get single expense
 * @param {string} id - id of the expense to return
 * @returns {object} Expense that matches given id
 */
async function getSingleExpense(id) {
  const expense = await Expense.findByPk(id, {
    attributes: {
      exclude: ['UserId']
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: User,
        as: 'payee',
        attributes: ['id', 'username']
      }
    ]
  })
  if (!expense) throw new NotFoundError('Expense not found')
  // Transform to object
  const expenseObj = expense.toJSON()
  // Remap tag objects to strings
  expenseObj.tags = expenseObj.tags.map((tag) => tag.name)
  return expenseObj
}

/**
 * Add expenses to database
 * @param {Object} data - Data of the expense to be added
 */
async function addExpenses(data) {
  let payee = await User.findByPk(data.payee.id)
  if (!payee) throw new NotFoundError('User id not found')

  console.log(data.price)
  let newExpense = await Expense.create(
    {
      title: data.title,
      price: data.price,
      description: data.description,
      date: data.date,
      resolved: data.resolved
    },
    {
      // TODO: update this to only include below and get fields directly from object
      // fields: ['title', 'description', 'price', 'date', 'resolved']
    }
  )
  console.log('New expense created')

  // Tag instances may or may not exist
  let tagPromises = data.tags.map((tag) => {
    return Tag.findOrCreate({
      where: {
        name: tag
      }
    })
  })
  let tags = await Promise.all(tagPromises)
  //tag[0] is the object, tag[1] is boolean, see findOrCreate
  tags = tags.map((tag) => tag[0])
  await newExpense.addTags(tags)
  await payee.addExpense(newExpense)
  await newExpense.reload({
    attributes: {
      exclude: ['UserId']
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: User,
        as: 'payee',
        attributes: ['id', 'username']
      }
    ]
  })
  // Transform to object
  newExpense = newExpense.get()
  // Remap tag objects to strings
  newExpense.tags = newExpense.tags.map((tag) => tag.name)
  return newExpense
}

/**
 * Delete expenses matching filter
 * @param {Object} filter - Filter expenses
 * @returns {int} Number of items deleted
 */
async function deleteExpenses(filter) {
  return await Expense.destroy({
    where: filter
  })
}

/**
 * Updates single expense matching given id
 * @param {Object} data - Fields to update
 * @param {Object} id - Id of the expense to update
 * @returns {Object} modified object
 */
async function updateExpense(data, id) {
  // Check if we need to change the payee
  const expenseToUpdate = await Expense.findByPk(id)
  if (!expenseToUpdate) {
    throw new NotFoundError('Expense not found', {
      message: 'Expense matching query id was not found'
    })
  }
  if (data.payee) {
    const payee = await User.findByPk(data.payee.id)
    if (!payee) throw new Error('Invalid payee id')
    payee.addExpense(expenseToUpdate)
  }
  if (data.tags) {
    const tagPromises = data.tags.map((tag) => {
      return Tag.findOrCreate({
        where: {
          name: tag
        }
      })
    })
    let tags = await Promise.all(tagPromises)
    //tag[0] is the object, tag[1] is boolean, see findOrCreate
    tags = tags.map((tag) => tag[0])
    await expenseToUpdate.setTags(tags)
  }

  await expenseToUpdate.update(data, {
    fields: ['title', 'description', 'price', 'date']
  })

  await expenseToUpdate.save()
  await expenseToUpdate.reload({
    attributes: {
      exclude: ['UserId']
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: {
          attributes: []
        }
      },
      {
        model: User,
        as: 'payee',
        attributes: ['id', 'username']
      }
    ]
  })
  // Transform to object
  let expenseToUpdateObj = expenseToUpdate.get()
  // Remap tag objects to strings
  expenseToUpdateObj.tags = expenseToUpdateObj.tags.map((tag) => tag.name)
  return expenseToUpdateObj
}

module.exports = {
  getExpenses,
  getSingleExpense,
  addExpenses,
  deleteExpenses,
  updateExpense
}
