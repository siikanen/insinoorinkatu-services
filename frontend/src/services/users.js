import axios from 'axios'
import jwt_decode from 'jwt-decode'
const baseUrl = `${process.env.REACT_APP_SERVER_URL}/users`

const logIn = async (credentials) => {
  const response= await axios.post(baseUrl + '/login', credentials)
  const {username,id} = jwt_decode(response.data.token)
  return {
    id,
    username,
    token:response.data.token
  }
}
const userService = {logIn}
export default userService
