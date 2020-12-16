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

const randomCategoryAmount = 2;
const randomUserAmount = 2;
const randomExpenseAmount = 5;
// TODO: Genereate a real JVT token here for testing
const testToken = "TODO";

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
  describe("Viewing expenses: GET /api/v1/expenses", () => {
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
      await generateRandomUsers(randomUserAmount);
      await generRandomCategories(randomCategoryAmount);
      await generateRandomExpenses(randomExpenseAmount);
    });
    it("should respond with JSON", async () => {
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
    });
    it("Should return all expenses when no filter is provided", async () => {
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.length(5);
    });
    it("Should return single expense when ID provided", async () => {
      const expenses = await Expense.findAll({});
      const expenseID = expenses[0].dataValues.id;
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          id: expenseID,
        });
      expect(response).to.have.status(200);
      expect(response.body[0].id).to.equal(expenseID);
      expect(response.body).to.have.length(1);
    });
    it("Should return multiple expenses when multiple IDs provided", async () => {
      const expenses = await Expense.findAll({});
      let expenseIDs = [];
      //length-1 since we dont want ALL the expenses
      for (i = 0; i < expenses.length-1; i++) {
        expenseIDs.push(expenses[i].id);
      }
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send(JSON.stringify(expenseIDs));
      expect(response).to.have.status(200);
    it("Should return 404 when ID does not exist", async () => {
      const fakeID = "FakeID";
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          id: fakeID,
        });
      expect(response).to.have.status(404);
      expect(response.body).to.equal(undefined);
    });
    it("Should return 404 when request body is not valid", async () => {
      const expenses = await Expense.findAll({});
      const expenseID = expenses[0].dataValues.id;
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          thisFieldDoesNotExist: expenseID,
        });
      expect(response).to.have.status(404);
      expect(response.body).to.equal(undefined);
    });
    it("Should respond with 401 unauthorized when Authorization header is missing", async () => {
      const response = await api.get(expenseURL);
      expect(response).to.have.status(401);
      expect(response.body).to.equal(undefined);
    });
    it("Should respond with 401 unauthorized when JVT token is incorrect", async () => {
      const response = await api
        .get(expenseURL)
        .set("Authorization", "Bearer notARealToken");
      expect(response).to.have.status(404);
      expect(response.body).to.equal(undefined);
    });
  });
});
