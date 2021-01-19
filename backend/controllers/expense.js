const { NotFoundError } = require('../utils/errors/userfacing')
const { User, Expense, Tag } = require('../database/models')
const { Op } = require('sequelize')

/**
 * Fetch all expenses matching filter as json
 *
 */
exports.index = async (req, res) => {
  const { skip, limit, month, year } = req.query
  const query = {}

  if (month || year) {
    // (month, !year) => select current year,
    // (!month, year) => select that month this year
    // (month, year) => select that month, that year
    const dateStart = new Date(year || new Date().getFullYear(), month - 1 || 0)
    const dateEnd = new Date(dateStart)
    if (month) dateEnd.setMonth(dateStart.getMonth() + 1)
    else dateEnd.setFullYear(dateStart.getFullYear() + 1)

    query['date'] = {
      [Op.gt]: dateStart,
      [Op.lt]: dateEnd
    }
  }
  let expenses = await Expense.findAll({
    where: query,
    limit: limit || 50,
    offset: skip || 0,
    order: [['date', 'DESC']],
    rejectOnEmpty: new NotFoundError('Expense not found')
  })
  // Transform to objects
  expenses = expenses.map((expense) => expense.get())
  // Remap tag objects to strings
  expenses = expenses.map((expense) => {
    expense.tags = expense.tags.map((tag) => tag.name)
    return expense
  })
  res.json({ data: expenses })
}

/** Get single expense
 * @param {string} id - id of the expense to return
 * @returns {object} Expense that matches given id
 */
exports.getSingleExpense = async (req, res) => {
  const expense = await Expense.findByPk(req.params.id, {
    rejectOnEmpty: new NotFoundError('Expense not found')
  })
  // Transform to object
  const expenseObj = expense.toJSON()
  // Remap tag objects to strings
  expenseObj.tags = expenseObj.tags.map((tag) => tag.name)
  return res.json({ data: expenseObj })
}

/**
 * Add expenses to database
 * @param {Object} data - Data of the expense to be added
 */
exports.createExpenses = async (req, res) => {
  const expensePromises = req.body.data.map(async (data) => {
    let payee = await User.findByPk(data.payee.id, {
      rejectOnEmpty: new NotFoundError('User id not found')
    })

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
    await newExpense.reload()
    // Transform to object
    newExpense = newExpense.toJSON()
    // Remap tag objects to strings
    newExpense.tags = newExpense.tags.map((tag) => tag.name)
    return newExpense
  })

  const newExpenses = await Promise.all(expensePromises)
  res.status(201).json({ data: newExpenses })
}

/**
 * Delete expenses matching filter
 * @param {Object} filter - Filter expenses
 * @returns {int} Number of items deleted
 */
exports.deleteExpense = async (req, res) => {
  await Expense.destroy(
    {
      where: {
        id: req.params.id
      }
    },
    {
      rejectOnEmpty: new NotFoundError('Expense not found')
    }
  )
  res.status(204).end()
}

/**
 * Updates single expense matching given id
 * @param {Object} data - Fields to update
 * @param {Object} id - Id of the expense to update
 * @returns {Object} modified object
 */
exports.updateExpense = async (req, res) => {
  const data = req.body.data
  const expenseToUpdate = await Expense.findByPk(req.params.id, {
    rejectOnEmpty: new NotFoundError('Expense not found')
  })
  // Check if we need to change the payee
  if (data.payee) {
    const payee = await User.findByPk(data.payee.id, {
      rejectOnEmpty: new NotFoundError('Payee id not found')
    })
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
    fields: ['title', 'description', 'price', 'date', 'resolved']
  })

  await expenseToUpdate.save()
  await expenseToUpdate.reload()
  // Transform to object
  let expenseToUpdateObj = expenseToUpdate.toJSON()
  // Remap tag objects to strings
  expenseToUpdateObj.tags = expenseToUpdateObj.tags.map((tag) => tag.name)
  res.json({
    data: expenseToUpdateObj
  })
}
