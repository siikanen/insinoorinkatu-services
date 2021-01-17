import expensesService from '../services/expenses'
import {intToPrice,humanizeDate} from '../utils/utils'
export const getAllExpenses = (searchParams={}) => {
  return async (dispatch) => {
    const response = await expensesService.getAllExpenses(searchParams)
    const data=response.data.data.map((expense) => {
      return {
        ...expense,
        price: intToPrice(expense.price),
        date: humanizeDate(expense.date)
      }
    })

    dispatch({
      type: 'SET_EXPENSES',
      data
    })
  }
}
export const updateExpense = (expenseToUpdate,id) => {
  return async (dispatch) => {
    const response= await expensesService.updateExpense(id, expenseToUpdate)
    const data=
      {
        ...response.data.data,
        price: intToPrice(response.data.data.price),
        date: humanizeDate(response.data.data.date)
      }
    dispatch({
      type: 'UPDATE_EXPENSE',
      data
    })
  }
}
export const deleteExpense = (id) => {
  return async (dispatch) => {
    await expensesService.deleteExpense(id)
    dispatch({
      type: 'DELETE_EXPENSE',
      data: { id }
    })
  }
}

export const addNewExpense = (expenseToAdd) => {
  return async (dispatch) => {
    const response = await expensesService.createExpense(expenseToAdd)
    const data=response.data.data.map((expense) => {
      return {
        ...expense,
        price: intToPrice(expense.price),
        date: humanizeDate(expense.date)
      }
    })

    dispatch({
      type: 'NEW_EXPENSE',
      data: data
    })
  }
}
const expensesReducer = (state = [], action) => {
  let newArray
  switch (action.type) {
  case 'SET_EXPENSES':
    return action.data
  case 'NEW_EXPENSE':
  // Wont work without this assingment.
    newArray = state.concat(action.data)
    return newArray
  case 'DELETE_EXPENSE':
    return state.filter((expense) => expense.id !== action.data.id)
  case 'UPDATE_EXPENSE':
    // Remember, store is immutable!
    return state.map((expense) =>
      expense.id === action.data.id ? action.data : expense
    )
  default:
    return state
  }
}

export default expensesReducer
