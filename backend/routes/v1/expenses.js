const expensesRouter = require('express').Router()

const {
  addExpenses,
  getExpenses,
  updateExpense,
  deleteExpenses
} = require('../../database/interface/expenseInterface')
const { NotFoundError } = require('../../utils/errors/userfacing')

expensesRouter
  .route('/')
  .get(async (req, res) => {
    // TODO: Validate the request and pass filters from req params to getExpenses()
    const allExpenses = await getExpenses()
    res.json({ data: allExpenses })
  })
  .post(async (req, res) => {
    const expensePromises = req.body.data.map((expense) => addExpenses(expense))
    const newExpenses = await Promise.all(expensePromises)
    res.status(201).json({ data: newExpenses })
  })
expensesRouter
  .route('/:id')

  .get(async (req, res) => {
    return res.json({ data: await getExpenses({ id: req.params.id }) })
  })

  .put(async (req, res) => {
    return res.json({
      data: await updateExpense(req.body.data, req.params.id)
    })
  })

  .delete(async (req, res) => {
    const numDeleted = await deleteExpenses({ id: req.params.id })
    if (numDeleted === 0) throw new NotFoundError('Expense not found')
    return res.status(204).end()
  })
module.exports = expensesRouter
