export const hideAlert = () => {
  return {
    type: 'HIDE_ALERT'
  }
}
/**
 * 
 * @param {*} type 
 * @param {*} message 
 * @param {*} timeout in ms. if -1, never hide alert, default 5000ms 
 * @returns 
 */
export const setAlert = (type, message, timeout=5000) => {
  if(!message){
    message='Something went wrong with the request!'
  }
  // Dont hide the message if no timeout
  if (timeout == -1) {
    return {
      type: 'SET_ALERT',
      data: {
        type,
        message
      }
    }
  }

  return async (dispatch) => {
    setTimeout(() => {
      dispatch(hideAlert())
    }, timeout)

    dispatch({
      type: 'SET_ALERT',
      data: {
        type,
        message
      }
    })
  }
}
const alertReducer = (
  state = {
    type: 'Hidden'
  },
  action
) => {
  switch (action.type) {
  case 'SET_ALERT':
    return action.data
  case 'HIDE_ALERT':
    return {
      type: 'Hidden',
      message: 'You should not see this'
    }
  default:
    return state
  }
}

export default alertReducer
