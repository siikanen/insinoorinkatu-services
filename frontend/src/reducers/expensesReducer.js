import expensesService from '../services/expenses'

export const getAllExpenses = (token)=>{
  return async dispatch =>{
    const response = await expensesService.getAllExpenses(token)
    dispatch({
      type: 'SET_EXPENSES',
      data: response.data
    })
  }
}
const expensesReducer = (state = [], action) => {

  switch (action.type) {
  case 'SET_EXPENSES':
    return action.data
  default:
    return state
  }
}

export default expensesReducer
