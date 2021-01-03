const express = require('express')

const {
  addExpenses,
  getExpenses,
  updateExpenses,
  deleteExpenses,
} = require('../../database/interface/expenseInterface')
const router = express.Router()

router
  .route('/')
  .get(async (req, res) => {
    // TODO: Validate the request and pass filters from req params to getExpenses()
    const allExpenses = await getExpenses()
    res.json({data: allExpenses})
  })
  .post(async (req, res) => {
    const expensePromises = req.body.data.map(expense => addExpenses(expense))
    const newExpenses = await Promise.all(expensePromises)
    res.status(201).json({data:newExpenses})
  })
// TODO: add update and delete methods
module.exports = router
