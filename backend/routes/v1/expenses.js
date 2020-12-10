const express = require('express')

const router = express.Router()

router.route('/')
//TODO: get all expenses, send them back
    .get( ( req, res  ) => {
        
        res.json({"test":"test"})
        //TODO: create a new expense based on req
    }).post((req,res)=>{
        res.json({"post":"post"})
    })
router.route('')
module.exports = router
