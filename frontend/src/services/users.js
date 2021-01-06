import axios from 'axios'
import jwt_decode from "jwt-decode";
const baseUrl = 'http://localhost:3000/api/v1/users'

const logIn = async (credentials) => {
  const response= await axios.post(baseUrl + '/login', credentials)
  const {username,id} = jwt_decode(response.data.token)
  return {
    id,
    username,
    token:response.data.token
  }
}
export default { logIn }
