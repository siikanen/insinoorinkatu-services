const express = require('express')
const expensesRouter = require('./expenses')
const usersRouter = require('./users')

const router = express.Router()

router.route('/')
    .get( ( req, res ) => {
        res.json({"monni":"test"})
    })

router.use('/expenses', expensesRouter)
router.use('/users', usersRouter)

module.exports = router;

