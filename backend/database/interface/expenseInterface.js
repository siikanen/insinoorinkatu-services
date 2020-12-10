const Expense = require("../models/expense")

const getAllExpenses= async()=>{
    const allExpenses = await Expense.findAll()
    return JSON.stringify(allExpenses)
}
const getExpense = async(id)=>{
    const expense = await Expense.findAll({
        where:{
            id:id
        }})
        return JSON.stringify(expense)
}
const addExpense=async(data)=>{
//TODO: Validate the fuukin data
const testExpense =await  Expense.create(data)
return testExpense
}
const deleteExpense = async(id)=>{
    try{
        await Expense.destroy({
            where:{
                id:id
            }
        })
    }
    catch(err){
        console.log(err)
    }
}
const updateExpense = async(data,id)=>{
    try{
      await Expense.update(data,{
           where:{
               id:id
           }
       }) 
    }catch(err){
        console.log(err)
    }
}
module.exports = {getAllExpenses,addExpense,getExpense,deleteExpense,updateExpense}