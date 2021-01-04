import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/v1/users'

const logIn = async (credentials) => {
  return await axios.post(baseUrl + '/login', credentials)
}
export default { logIn }
