const express = require('express')

const {addExpense, getAllExpenses, getExpense,updateExpense,deleteExpense} = require("../../database/interface/expenseInterface")
const router = express.Router()

router.route('/')
//TODO: get all expenses, send them back
    .get(async ( req, res  ) => {
        try{
            const allExpenses =await  getAllExpenses()
            res.json(allExpenses)
        }catch(err){
            console.log(err)
            res.status(500).send()
        }
        //TODO: create a new expense based on req
    }).post(async(req,res)=>{
        console.log(req.body)
        await addExpense(req.body)
        res.status(201).json({})
    })
router.route('')
module.exports = router
