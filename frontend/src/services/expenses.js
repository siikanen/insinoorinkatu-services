import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/v1/expenses'
// TODO Make a better exception handling
const getAllExpenses = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  try {
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (err) {
    console.error(err)
    return []
  }
}
const getExpenseById = async (token, id) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  try {
    const response = await axios.get(`${baseUrl}/${id}`, config)
    return response.data
  } catch (err) {
    console.error(err)
    return {}
  }
}
const updateExpense = async (token,id, expenseToUpdate) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let data = { data: expenseToUpdate }

  try {
    await axios.put(`${baseUrl}/${id}`, data,config)
    return
  } catch (err) {
    console.error(err)
    return undefined
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
export default { getAllExpenses, createExpense,getExpenseById,updateExpense }
