import usersService from '../services/users'
export const logIn = (user) => {
  return async (dispatch) => {
    const loggedInUser = await usersService.logIn(user)
    window.localStorage.setItem('loggedUser',JSON.stringify(loggedInUser))

    dispatch({
      type: 'SET_LOGGED_USER',
      data: {user}
    })
  }
}
const usersReducers = (state = {}, action) => {
  switch (action.type) {
  case 'SET_LOGGED_USER':
    return { ...state, loggedInUser: action.data }
  default:
    return state
  }
}

export default usersReducers
