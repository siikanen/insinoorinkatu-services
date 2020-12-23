const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const expenseURL = "/api/v1/expenses";
const models = require("../database/models");
const Expense = models.Expense;
const User = models.User;
const chaiHttp = require("chai-http");
const faker = require("faker");
chai.use(chaiHttp);

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


describe("Routes", () => {
  describe("Expenses: GET /api/v1/expenses", () => {
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

      await generateRandomUsers(randomUserAmount);
      await generateRandomExpenses(randomExpenseAmount);
    });
    describe("Authorization tests", () => {
      it("Should respond with 401 unauthorized when Authorization header is missing", async () => {
        const response = await api.get(expenseURL);
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
      it("Should respond with 401 unauthorized when JVT token is incorrect", async () => {
        const response = await api
          .get(expenseURL)
          .set("Authorization", "Bearer notARealToken");
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
    })
    describe("Filter tests", () => {

    it("should respond with JSON", async () => {
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
      expect(response).to.be.json;
        expect(response.body.data).to.be.an("array");
    });

    it("Should return all expenses when no filter is provided", async () => {
      const response = await api
        .get(expenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
        expect(response.body.data).to.have.length(randomExpenseAmount);
    });

      it("Should return filtered expenses when filter ?year=2020 provided", async () => {
      const response = await api
          .get(expenseURL + "?year=2020")
          .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
        let responseExpenses = response.body.data
        responseExpenses.forEach((value) => {
          expect(value.date.substring(0, 3)).to.equal("2020")
        })
    });

      it("Should return empty data array when no expenses found", async () => {
        //There "shouldn't" be any expenses for the year 1
      const response = await api
          .get(expenseURL + "?year=1")
        .set("Authorization", `Bearer ${testToken}`)
      expect(response).to.have.status(200);
        expect(response.body.data).to.equal([]);
    });

      it("Should return 400 when query is not valid", async () => {
      const response = await api
          .get(expenseURL + "?year=NotAnumber")
        .set("Authorization", `Bearer ${testToken}`)
      expect(response).to.have.status(400);
        expect(response.body.error).to.exist();
    });
    })
  })
  describe("Expenses: POST /api/expenses", () => {
    //Initiate a test expense
    let testExpense;

    before(async () => {
      await Expense.destroy({
        where: {},
        truncate: true,
      });
      await User.destroy({
        where: {},
        truncate: true,
      });

      await generateRandomUsers(randomUserAmount);
      //Set test expense fields
      let users = await User.findAll({});
      let userID = users[0].id;
      testExpense = {
        "title": "test Title",
        "description": "test description",
        "amount": 1000,
        //TODO: model currenly does not support date
        "date": {},
        //TODO: revise if payee ID is enough
        "payee": {
          "id": userID,
          "username": users[0].username
        },
        "tags": [
          "testTag",
          "secondTestTag"
        ]
      };
    });
    beforeEach(async () => {
      // No need to clear anything else than expenses between tests
      await Expense.destroy({
        where: {},
        truncate: true,
      });
    });
    describe("Authorization tests", () => {

    it("Should respond with 401 unauthorized when Authorization header is missing", async () => {

      const response = await api.post(expenseURL).send(testExpense);
      expect(response).to.have.status(401);
      expect(response.body).to.equal(undefined);
        const expensesInDB = await Expense.findAll({});
      expect(expensesInDB).to.have.length(0);
    });
    it("Should respond with 401 unauthorized when JVT token is incorrect", async () => {
      const response = await api
        .post(expenseURL)
        .set("Authorization", "Bearer notARealToken")
        .send(testExpense);
      expect(response).to.have.status(401);
      expect(response.body).to.equal(undefined);
        const expensesInDB = await Expense.findAll({});
        expect(expensesInDB).to.have.length(0);
      });
    })

    it("Should return 400 when request body is not valid", async () => {
      const response = await api
        .post(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          notRealField: 2,
        });
      expect(response).to.have.status(400);
      expect(response.body.error).to.exist()
      const expensesInDB = await Expense.findAll({});
      expect(expensesInDB).to.have.length(0);
    });
    it("Should add a new expense, when a single expense is provided", async () => {
      const response = await api
        .post(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testExpense);
      const expensesInDB = await Expense.findAll({});
      expect(response).to.have.status(201);
      expect(expensesInDB).to.have.length(1);
      expect(expensesInDB[0].title).to.be.equal("testTitle");
    });
    it("Should return the added expense", async () => {
      const response = await api
        .post(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send(testExpense);
      const expensesInDB = await Expense.findAll({});
      expect(response).to.have.status(201);
      expect(response.body.data).to.have.all.keys(
        "id", "created", "updated", "title", "description", "amount", "date", "payee", "tags")
    })

    it("Should add multiple new expenses, when multiple expenses are provided", async () => {
      const testExpense2 = { ...testExpense };
      testExpense2.title = "TitleIsChanged";
      const response = await api
        .post(expenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        //TODO: Might need to send in a different format
        .send([testExpense, testExpense2]);
      const expensesInDB = await Expense.findAll({});
      expect(response).to.have.status(201);
      expect(expensesInDB).to.have.length(2);
      expect(response.body.data).to.have.length(2)
    });
  });
  describe("Expenses: GET /api/expenses/{id}", () => {
    let testExpense;
    let testExpenseID;
    let singleExpenseURL;
    before(async () => {
      await Expense.destroy({
        where: {},
        truncate: true,
      });
      await User.destroy({
        where: {},
        truncate: true,
      });

      await generateRandomUsers(randomUserAmount);
      await generateRandomExpenses(randomExpenseAmount);
      //Some overhead here, assining array[0] directly from findall does not seem to work
      testExpense = await Expense.findAll({});
      testExpense = testExpense[0]
      testExpenseID = testExpense.id
      singleExpenseURL = expenseURL + `/${testExpenseID}`
    })
    describe("Authorization tests", () => {
      it("Should respond with 401 unauthorized when Authorization header is missing", async () => {
        const response = await api.get(singleExpenseURL);
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
      it("Should respond with 401 unauthorized when JVT token is incorrect", async () => {
        const response = await api
          .get(singleExpenseURL)
          .set("Authorization", "Bearer notARealToken");
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
    })
    it("Should respond with 404 when ID is wrong", async () => {
      const response = await api
        .get(singleExpenseURL + "somethingExtra")
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.exist()
    })
    it("Should respond with 200", async () => {
      const response = await api
        .get(singleExpenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
    })
    it("Should return the correct expense", async () => {
      const response = await api
        .get(singleExpenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(200);
      expect(response.body.data.id).to.equal(testExpenseID)
      expect(response.body.data).to.have.all.keys(
        "id", "created", "updated", "title", "description", "amount", "date", "payee", "tags")
    })
  })
  describe("Expenses: PUT /api/expenses/{id}", () => {
    let testExpense;
    let testExpenseID;
    let modifiedTestExpense;
    let singleExpenseURL;
    before(async () => {
      await Expense.destroy({
        where: {},
        truncate: true,
      });
      await User.destroy({
        where: {},
        truncate: true,
    });

      await generateRandomUsers(randomUserAmount);
    })
    beforeEach(async () => {
      // No need to clear anything else than expenses between tests
      await Expense.destroy({
        where: {},
        truncate: true,
      });
      // TODO: Change the amount of expenses generated
      // In theory, it is enough to test with a singe expense when deleting
      // Clearing the expenses causes the ID to change, so it needs te be re-aquired
      await generateRandomExpenses(randomExpenseAmount);
      //Some overhead here, assining array[0] directly from findall does not seem to work
      testExpense = await Expense.findAll({});
      testExpense = testExpense[0]
      modifiedTestExpense = { ...testExpense }
      modifiedTestExpense.title = "Modified"
      modifiedTestExpense.amount = 1337
      testExpenseID = testExpense.id
      singleExpenseURL = expenseURL + `/${testExpenseID}`
  });
    describe("Authorization tests", () => {
      it("Should respond with 401 unauthorized when Authorization header is missing", async () => {
        const response = await api.put(singleExpenseURL).send(testExpense);
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
      it("Should respond with 401 unauthorized when JVT token is incorrect", async () => {
        const response = await api
          .put(singleExpenseURL)
          .set("Authorization", "Bearer notARealToken")
          .send(testExpense);
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
    })
    it("Should respond with 404 when ID is wrong", async () => {
      const response = await api
        .put(singleExpenseURL + "somethingExtra")
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.exist()
    })
    it("Should respond with 200", async () => {
      const response = await api
        .get(singleExpenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send(modifiedTestExpense)
      expect(response).to.have.status(200);
    })
    it("Should modify the expense", async () => {
      const response = await api
        .get(singleExpenseURL)
        .set("Authorization", `Bearer ${testToken}`)
        .send(modifiedTestExpense)
      expect(response).to.have.status(200);
      let expenseInDB = await Expense.findOne({ where: { id: testExpenseID } })
      expect(expenseInDB).to.have.all.keys(
        "id", "created", "updated", "title", "description", "amount", "date", "payee", "tags")
      expect(expenseInDB.title).to.equal("Modified")
      expect(expenseInDB.amount).to.equal(1337)
    })
  })
  describe("Expenses: DELETE /api/expenses/{id}", () => {
    let testExpense;
    let testExpenseID;
    let singleExpenseURL;
    before(async () => {
      await Expense.destroy({
        where: {},
        truncate: true,
      });
      await User.destroy({
        where: {},
        truncate: true,
      });

      await generateRandomUsers(randomUserAmount);
    })
    beforeEach(async () => {
      // No need to clear anything else than expenses between tests
      await Expense.destroy({
        where: {},
        truncate: true,
      });
      // TODO: Change the amount of expenses generated
      // In theory, it is enough to test with a singe expense when deleting
      await generateRandomExpenses(randomExpenseAmount);
      //Some overhead here, assining array[0] directly from findall does not seem to work
      testExpense = await Expense.findAll({});
      testExpense = testExpense[0]
      testExpenseID = testExpense.id
      singleExpenseURL = expenseURL + `/${testExpenseID}`
    })

    describe("Authorization tests", () => {
      it("Should respond with 401 unauthorized when Authorization header is missing", async () => {
        const response = await api.delete(singleExpenseURL);
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
      it("Should respond with 401 unauthorized when JVT token is incorrect", async () => {
        const response = await api
          .delete(singleExpenseURL)
          .set("Authorization", "Bearer notARealToken")
        expect(response).to.have.status(401);
        expect(response.body.error).to.exist();
      });
    })
    it("Should respond with 404 when ID is wrong", async () => {
      const response = await api
        .delete(singleExpenseURL + "somethingExtra")
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.exist()
    })
    it("Should respond with 204", async () => {
      const response = await api
        .delete(singleExpenseURL)
        .set("Authorization", `Bearer ${testToken}`);
      expect(response).to.have.status(204);
    })
  })
});
