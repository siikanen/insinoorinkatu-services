import usersService from '../services/users'

export const logIn = (user) => {
  return async (dispatch) => {
    let response = await usersService.logIn(user)
    console.log(response.data)
    window.localStorage.setItem('token', response.data.token)

    dispatch({
      type: 'SET_LOGGED_USER',
      data: { username: user.username, token: response.data.token }
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
