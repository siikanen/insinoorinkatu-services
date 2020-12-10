//TODO: methods such as delete and update should return the expense, rather than return nothing
const Expense = require("../models/expense")
/**
 * Fetch all expenses as json
 * 
 */
async function getAllExpenses(){
    const allExpenses = await Expense.findAll()
    return JSON.stringify(allExpenses)
}
async function getExpense(id){
    const expense = await Expense.findAll({
        where:{
            id:id
        }})
        return JSON.stringify(expense)
}
/**
 * Add a new expense to database
 * @param {JSON} data - Data of the expense to be added 
 */
const addExpense=async(data)=>{
//TODO: Validate the data before creating
const testExpense =await  Expense.create(data)
return testExpense
}
/**
 * Delete an expense from database
 * @param {*} id - Id of the expense to be deleted 
 */
async function deleteExpense(id){
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
/**
 * Updates an expense in the database
 * @param {} data 
 * @param {*} id 
 */
async function updateExpense(data,id){
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