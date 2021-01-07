import expensesService from '../services/expenses'
import { useSelector } from 'react-redux'

export const getAllExpenses = (token) => {
  return async (dispatch) => {
    const response = await expensesService.getAllExpenses(token)
    dispatch({
      type: 'SET_EXPENSES',
      data: response.data
    })
  }
}
export const updateExpense = (token, expenseToUpdate) => {
  return async (dispatch) => {
    await expensesService.updateExpense(
      token,
      expenseToUpdate.id,
      expenseToUpdate
    )
    // TODO replace the line below with error handling
    dispatch({
      type: 'UPDATE_EXPENSE',
      data: expenseToUpdate
    })
  }
}

export const addNewExpense = (token, expenseToAdd) => {
  return async (dispatch) => {
    const response = await expensesService.createExpense(token, expenseToAdd)
    // TODO replace the line below with error handling
    if (!response) return
    dispatch({
      type: 'NEW_EXPENSE',
      data: response.data
    })
  }
}
const expensesReducer = (state = [], action) => {
  let newState
  switch (action.type) {
    case 'SET_EXPENSES':
      return action.data
    case 'NEW_EXPENSE':
      return state.concat(action.data)
    case 'UPDATE_EXPENSE':
      // Remember, store is immutable!
      return state.map(expense=>expense.id === action.data.id ? action.data : expense)
    default:
      return state
  }
}

export default expensesReducer
