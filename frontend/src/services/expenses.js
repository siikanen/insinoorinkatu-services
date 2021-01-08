import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/v1/expenses'
// TODO Make a better exception handling
//Format the price, e.g 1010 = 10,10
const formatPrice = function (expense) {
  const len = expense.amount.toString().length
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
  const response = await axios.get(baseUrl, config)
  return response.data.data.map(formatPrice)
}
const getExpenseById = async (token, id) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const response = await axios.get(`${baseUrl}/${id}`, config)
  //TODO: Remove [0] when backend is fixed
  return formatPrice(response.data.data[0])
}
const updateExpense = async (token, id, expenseToUpdate) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const data = { data: expenseToUpdate }

  await axios.put(`${baseUrl}/${id}`, data, config)
}
const deleteExpense = async (token, id) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }

  await axios.delete(`${baseUrl}/${id}`, config)
}
const createExpense = async (token, expenseToAdd) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const data = { data: [expenseToAdd] }
  const response = await axios.post(baseUrl, data, config)
  return response.data.data.map(formatPrice)
}
export default {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
}
