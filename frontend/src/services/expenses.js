import axios from 'axios'
import {
  getToken,
  formQueryString,
} from '../utils/utils'
const baseUrl = `${process.env.REACT_APP_SERVER_URL}/expenses`

//Format the price, e.g 1010 = 10,10

const getAllExpenses = async (searchParams = {}) => {
  var queryString = formQueryString(searchParams)
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  return await axios.get(`${baseUrl}?${queryString}`, config)
}
const getExpenseById = async (id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  return await axios.get(`${baseUrl}/${id}`, config)
}
const updateExpense = async (id, expenseToUpdate) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const data = {
    data: expenseToUpdate
  }
  return await axios.put(`${baseUrl}/${id}`, data, config)
}
const deleteExpense = async (id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  await axios.delete(`${baseUrl}/${id}`, config)
}
const createExpense = async (expenseToAdd) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const data = {
    data: [expenseToAdd]
  }
  return await axios.post(baseUrl, data, config)
}
const expenseService = {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
}
export default expenseService
