const expensesRouter = require('express').Router()

const expenseController = require('../../controllers/expense')

expensesRouter
  .route('/')
  .get(expenseController.index)
  .post(expenseController.createExpenses)

expensesRouter
  .route('/:id')
  .get(expenseController.getSingleExpense)
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense)

module.exports = expensesRouter
