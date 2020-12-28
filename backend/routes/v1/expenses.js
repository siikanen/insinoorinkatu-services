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
    console.log(req.body)
    await addExpenses(req.body)
    res.status(201).send()
  })
// TODO: add update and delete methods
module.exports = router
