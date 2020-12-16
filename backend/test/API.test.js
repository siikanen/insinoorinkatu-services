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

const randomExpenseAmount = 5;
// helper function for authorization headers

async function generateRandomExpenses(amount) {
  // TODO: Generate expenses for other users aswell
  let users = await User.findAll({});
  let userID = users[0].id;
  for (i = 0; i < amount; i++) {
    await Expense.create({
      title: faker.commerce.productName(),
      amount: faker.random.number(),
      userID: userID,
    });
  }
}
// TODO: password hash and salt not working
async function generateRandomUsers(amount) {
  for (i = 0; i < amount; i++) {
    await User.create({
      username: `test${i}`,
      password: "test",
    });
  }
}
async function generRandomCategories(amount) {
  for (i = 0; i < amount; i++) {
    await Category.create({
      name: faker.commerce.department(),
    });
  }
}

describe("Routes", () => {
  // Get should not have side effects,
  // thus setup data only once
  before(async () => {
    await Expense.destroy({
      where: {},
      truncate: true,
    });
    await User.destroy({
      where: {},
      truncate: true,
    });
    await Category.destroy({
      where: {},
      truncate: true,
    });
    await generateRandomUsers(1);
    await generRandomCategories(1);
    await generateRandomExpenses(randomExpenseAmount);
  });
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