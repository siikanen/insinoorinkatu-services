import usersService from '../services/users'
export const logIn = (user) => {
  console.log('Trying to login', user)
  return async (dispatch) => {
    let response = await usersService.logIn(user)
    console.log(response)
    dispatch({
      type: 'SET_TOKEN',
      data: response.data.token
    })
  }
}
const usersReducers = (state = {}, action) => {
  console.log(action)
  switch (action.type) {
    case 'SET_TOKEN':
      return {...state, token:action.data}
    default:
      return state
  }
}

export default usersReducers
