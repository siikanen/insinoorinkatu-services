import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/v1/expenses'
// TODO Make a better exception handling
//Format the price, e.g 1010 = 10,10
let formatPrice = function (expense) {
  let len = expense.amount.toString().length
  switch (len) {
    case 2:
      expense.amount = `0,${expense.amount}`
      break
    case 1:
      expense.amount = `0,${expense.amount}0`
      break
    default:
      expense.amount = `${expense.amount
        .toString()
        .substring(0, len - 2)},${expense.amount.toString().substring(len - 2)}`
      break
  }

  return expense
}

const getAllExpenses = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  try {
    const response = await axios.get(baseUrl, config)
    return response.data.data.map(formatPrice)
  } catch (err) {
    console.error(err)
    return []
  }
}
const getExpenseById = async (token, id) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  try {
    const response = await axios.get(`${baseUrl}/${id}`, config)
    return formatPrice(response.data.data[0])
  } catch (err) {
    console.error(err)
    return {}
  }
}
const updateExpense = async (token, id, expenseToUpdate) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let data = { data: expenseToUpdate }

  try {
    await axios.put(`${baseUrl}/${id}`, data, config)
    return
  } catch (err) {
    console.error(err)
    return undefined
  }
}
const deleteExpense = async (token, id) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }

  try {
    await axios.delete(`${baseUrl}/${id}`, config)
    return
  } catch (err) {
    console.error(err)
    return
  }
}
const createExpense = async (token, expenseToAdd) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let data = { data: [expenseToAdd] }
  try {
    const response = await axios.post(baseUrl, data, config)
    return response.data
  } catch (err) {
    console.error(err)
    return undefined
  }
}
export default {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
}
