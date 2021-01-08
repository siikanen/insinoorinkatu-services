import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/v1/expenses'
// TODO Make a better exception handling
//Format the price, e.g 1010 = 10,10
const formatPrice = function (expense) {
  expense.price = expense.price/100
  return expense
}
const getToken = function(){
  return JSON.parse(window.localStorage.getItem('loggedUser')).token
}
const getAllExpenses = async () => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const response = await axios.get(baseUrl, config)
  return response.data.data.map(formatPrice)
}
const getExpenseById = async ( id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const response = await axios.get(`${baseUrl}/${id}`, config)
  //TODO: Remove [0] when backend is fixed
  return formatPrice(response.data.data[0])
}
const updateExpense = async ( id, expenseToUpdate) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const data = { data: expenseToUpdate }

  await axios.put(`${baseUrl}/${id}`, data, config)
}
const deleteExpense = async ( id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }

  await axios.delete(`${baseUrl}/${id}`, config)
}
const createExpense = async ( expenseToAdd) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
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
