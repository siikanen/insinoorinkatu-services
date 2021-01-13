import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_SERVER_URL}/expenses`
//Format the price, e.g 1010 = 10,10
const intToPrice = (price) => {
  return price / 100
}
const priceToInt = (price) => {
  return Math.trunc(price * 100)
}
const getToken = function () {
  return JSON.parse(window.localStorage.getItem('loggedUser')).token
}
const humanizeDate = (date) => {
  return `${new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(date))}`
}
const getAllExpenses = async () => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const response = await axios.get(baseUrl, config)
  return response.data.data.map((expense) => {
    return {
      ...expense,
      price: intToPrice(expense.price),
      date: humanizeDate(expense.date)
    }
  })
}
const getExpenseById = async (id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const response = await axios.get(`${baseUrl}/${id}`, config)
  //TODO: Remove [0] when backend is fixed
  return {
    ...response.data.data,
    price: intToPrice(response.data.data.price),
    tags: response.data.data.tags || []
  }
}
const updateExpense = async (id, expenseToUpdate) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const data = { data: expenseToUpdate }

  await axios.put(`${baseUrl}/${id}`, data, config)
}
const deleteExpense = async (id) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }

  await axios.delete(`${baseUrl}/${id}`, config)
}
const createExpense = async (expenseToAdd) => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  const expenseToSend = {
    ...expenseToAdd,
    price: priceToInt(expenseToAdd.price)
  }
  const data = {
    data: [expenseToSend]
  }
  const response = await axios.post(baseUrl, data, config)
  return response.data.data.map(intToPrice)
}
const expenseService = {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
}
export default expenseService
