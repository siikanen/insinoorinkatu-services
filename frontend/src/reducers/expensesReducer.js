import expensesService from '../services/expenses'

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
    dispatch({
      type: 'UPDATE_EXPENSE',
      data: expenseToUpdate
    })
  }
}
export const deleteExpense = (token, id) => {
  return async (dispatch) => {
    await expensesService.deleteExpense(token, id)
    dispatch({
      type: 'DELETE_EXPENSE',
      data: { id }
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
  switch (action.type) {
    case 'SET_EXPENSES':
      return action.data
    case 'NEW_EXPENSE':
      return state.concat(action.data)
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
