const expensesRouter = require('express').Router()

const {
  addExpenses,
  getSingleExpense,
  getExpenses,
  updateExpense,
  deleteExpenses
} = require('../../database/interface/expenseInterface')
const { NotFoundError } = require('../../utils/errors/userfacing')

expensesRouter
  .route('/')
  .get(async (req, res) => {
    const allExpenses = await getExpenses(req)
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
    return res.json({ data: await getSingleExpense( req.params.id )})
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
