import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/v1/expenses'

const getAllExpenses = async (token) => {

   const config = { headers: { Authorization: `Bearer ${token}` }, }
   try{
     const response = await axios.get(baseUrl, config)

     return response.data
   }
   catch(err){
     console.error(err)
     return []
   }
}
export default { getAllExpenses }
