import expensesService from '../services/expenses'

export const getAllExpenses = () => {
  return async (dispatch) => {
    const data = await expensesService.getAllExpenses()
    dispatch({
      type: 'SET_EXPENSES',
      data
    })
  }
}
export const updateExpense = ( expenseToUpdate) => {
  return async (dispatch) => {
    await expensesService.updateExpense(

      expenseToUpdate.id,
      expenseToUpdate
    )
    dispatch({
      type: 'UPDATE_EXPENSE',
      data: expenseToUpdate
    })
  }
}
export const deleteExpense = ( id) => {
  return async (dispatch) => {
    await expensesService.deleteExpense( id)
    dispatch({
      type: 'DELETE_EXPENSE',
      data: { id }
    })
  }
}

export const addNewExpense = ( expenseToAdd) => {
  return async (dispatch) => {
    const response = await expensesService.createExpense( expenseToAdd)
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
