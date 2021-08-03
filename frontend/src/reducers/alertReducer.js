export const hideAlert = () => {
  return {
    type: 'HIDE_ALERT'
  }
}
/**
 * 
 * @param {*} alertType 
 * @param {*} content 
 * @param {*} timeout in ms. if -1, never hide alert, default 5000ms 
 * @returns 
 */
export const setAlert = (alertType, content, timeout = 5000) => {
  let message = content
  let alertDisplayType = alertType
  switch (alertType) {
  case 'SERVER_ERROR':
    if (content?.response?.status) {
      message = `${content.response.status}: `
    }
    else {
      message = 'No status code from server: '
    }
    if (content?.response?.data?.error?.message) {
      message += `${content.response.data.error.message}`
    }
    else {
      message += 'No message from server!'
    }
    alertDisplayType = 'ERROR'
    break
  case 'INTERNAL_ERROR':
    message = content
    alertDisplayType = 'ERROR'
  }
  if (!content) {
    message = 'Something went wrong with the request!'
  }
  // Dont hide the message if no timeout
  if (timeout == -1) {
    return {
      type: 'SET_ALERT',
      data: {
        alertDisplayType,
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
        alertDisplayType,
        message,
      }
    })
  }
}
const alertReducer = (
  state = {
    type: 'HIDDEN'
  },
  action
) => {
  switch (action.type) {
  case 'SET_ALERT':
    return action.data
  case 'HIDE_ALERT':
    return {
      alertDisplayType: 'HIDDEN',
      message: 'You should not see this'
    }
  default:
    return state
  }
}

export default alertReducer
