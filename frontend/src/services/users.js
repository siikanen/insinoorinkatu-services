import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { getToken } from '../utils/utils'
const baseUrl = `${process.env.REACT_APP_SERVER_URL}/users`

const logIn = async (credentials) => {
  const response = await axios.post(baseUrl + '/login', credentials)
  const { username, id } = jwt_decode(response.data.token)
  return {
    id,
    username,
    token: response.data.token
  }
}
const register = async (userToAdd) => {
  return await axios.post(baseUrl, userToAdd)
}
const getUsers = async () => {
  const config = { headers: { Authorization: `Bearer ${getToken()}` } }
  return await axios.get(baseUrl, config)
}
const userService = { logIn, register, getUsers, register }
export default userService
