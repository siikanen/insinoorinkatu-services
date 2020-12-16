const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const expenseURL = "/api/v1/expenses";
const models = require("../database/models");
const Expense = models.Expense;
const User = models.User;
const Category = models.Category;
const chaiHttp = require("chai-http");
const faker = require("faker");
chai.use(chaiHttp);

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random()
      .toString(36)
      .substr(2, 9)
      .trim();
  } while (str.length < len);

  return str.substr(0, len);
};

function getRandomExpenses(amount){
    let expenses =[]
    do{
        expenses.push({
            "date":generateRandomString(2),
            "title":generateRandomString(4),
            "description":generateRandomString(5),
            "amount":Math.random() * Math.floor(100),
            "payee":generateRandomString(),
            "category":generateRandomString()

        })
    }while(expenses.length < amount)
    return expenses
}
const randomExpenses = getRandomExpenses(5)
describe('Routes', () => {

  beforeEach(async () => {
   await Expense.destroy({
       where:{},
       truncate: true
   })
   await Expense.bulkCreate(randomExpenses)
  })
    describe('Viewing all expenses: GET /api/v1/expenses', () => {
      it('should respond with "406 Not Acceptable" when Accept header is missing', async () => {
        const response = await api.get(expenseURL);
        expect(response).to.have.status(406);
      });

      it('should respond with "406 Not Acceptable" when client does not accept JSON', async () => {
        const response = await api.get(expenseURL)
          .request(handleRequest)
          .get(usersUrl)
          .set('Accept', 'text/html');

        expect(response).to.have.status(406);
      });

      it('should respond with JSON', async () => {
        const response = await api.get(expenseURL)
        console.log(response.status)
        expect(response).to.have.status(200)
        expect(response).to.be.json;
        console.log(response.body)
        expect(JSON.parse(response.body)).to.be.an('array');
      });
    });
})