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
    try {
      const allExpenses = await getExpenses()
      res.json(allExpenses)
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  })
  .post(async (req, res) => {
    const expensePromises = req.body.data.map(expense => addExpenses(expense))
    const newExpenses = await Promise.all(expensePromises)
    res.status(201).json({data:newExpenses})
  })
// TODO: add update and delete methods
module.exports = router
