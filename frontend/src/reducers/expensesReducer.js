import expensesService from '../services/expenses'

export const getAllExpenses = (searchParams={}) => {
  return async (dispatch) => {
    const data = await expensesService.getAllExpenses(searchParams)
    dispatch({
      type: 'SET_EXPENSES',
      data
    })
  }
}
export const updateExpense = (expenseToUpdate) => {
  return async (dispatch) => {
    await expensesService.updateExpense(expenseToUpdate.id, expenseToUpdate)
    dispatch({
      type: 'UPDATE_EXPENSE',
      data: expenseToUpdate
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
    const data = await expensesService.createExpense(expenseToAdd)
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
