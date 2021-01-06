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
const createExpense = async(token,expenseToAdd)=>{

  console.log(expenseToAdd)
   const config = { headers: { Authorization: `Bearer ${token}` }, }
   let data = {data:[expenseToAdd
  ]}
  console.log(data)
   try{
     const response = await axios.post(baseUrl,data,config)
     return response.data
   }
   catch(err){
     console.error(err)
     return undefined
   }
}
export default { getAllExpenses,createExpense }
