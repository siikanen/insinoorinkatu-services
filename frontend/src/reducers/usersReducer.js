import usersService from '../services/users'
export const logIn = (user) => {
  return async (dispatch) => {
    const loggedInUser = await usersService.logIn(user)
    window.localStorage.setItem('loggedUser', JSON.stringify(loggedInUser))

    dispatch({
      type: 'SET_LOGGED_USER',
      data: { user }
    })
  }
}
export const addUser = (userToAdd) => {
  return async (dispatch) => {
    const response = await usersService.register(userToAdd)
    const data = response.data
    dispatch({
      type: 'NEW_USER',
      data
    })
  }
}
export const getUsers = (serchParams = {}) => {
  return async (dispatch) => {
    const response = await usersService.getUsers()
    const data = response.data.data
    dispatch({
      type: 'SET_USERS',
      data
    })
  }
}
const usersReducers = (
  state = {
    allUsers: [],
    loggedInUser: {}
  },
  action
) => {
  switch (action.type) {
  case 'SET_USERS':
    return { ...state, allUsers: action.data }
  case 'NEW_USER':
    return { ...state, allUsers: state.allUsers.concat(action.data) }
  case 'SET_LOGGED_USER':
    return { ...state, loggedInUser: action.data }
  default:
    return state
  }
}

export default usersReducers
