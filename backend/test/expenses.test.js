const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const expenseURL = '/api/v1/expenses'
const usersURL = '/api/v1/users'
const models = require('../database/models')
const { User, Expense } = models
const {
  generateRandomExpenses,
  generateRandomUsers,
  randomExpenseAmount,
  randomUserAmount
} = require('./testHelper')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

let testToken = 'notYetInitialized'
async function getToken() {
  await generateRandomUsers(randomUserAmount)
  let loginResponse = await api.post(`${usersURL}/login`).send({
    username: 'test0',
    password: 'test'
  })

  return loginResponse.body.token
}
const testExpenseTemplate = {
  data: [
    {
      title: 'testTitle',
      description: 'testDescription',
      amount: 1000,
      date: new Date(),
      // Dynamically need to add payee here in order to get ID
      tags: ['testTag1', 'testTag2']
    }
  ]
}

// Initialize sqlite:memory: before tests
before(async () => {
  await models.sequelize.sync({ force: true })
  testToken = await getToken()
})
describe('Expenses', () => {
  //Initialize tables and JWT token
  before(async () => {})
  describe('Expenses: GET /api/v1/expenses', () => {
    // Get should not have side effects,
    // thus setup data only once
    before(async () => {
      await Expense.destroy({
        where: {}
      })
      await generateRandomExpenses(randomExpenseAmount)
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.get(expenseURL)
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .get(expenseURL)
          .set('Authorization', 'Bearer notARealToken')
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
    })
    describe('Filter tests', () => {
      it('should respond with JSON', async () => {
        const response = await api
          .get(expenseURL)
          .set('Authorization', `Bearer ${testToken}`)
        expect(response).to.have.status(200)
        expect(response).to.be.json
        expect(response.body.data).to.be.an('array')
      })

      it('Should return all expenses when no filter is provided', async () => {
        const response = await api
          .get(expenseURL)
          .set('Authorization', `Bearer ${testToken}`)
        expect(response).to.have.status(200)
        expect(response.body.data).to.have.length(randomExpenseAmount)
        response.body.data.forEach((expense) => {
          expect(expense).to.have.all.keys(
            'id',
            'createdAt',
            'updatedAt',
            'title',
            'description',
            'amount',
            'date',
            'payee',
            'tags'
          )
          expect(expense.payee).to.not.have.any.keys('salt', 'passwordHash')
        })
      })

      /*
        it('Should return filtered expenses when filter ?year=currentYear provided', async () => {
          // Add an expense in the past using POST
          const testDate = new Date()
          testDate.setFullYear(testDate.getFullYear() - 1)
          const testExpense2 = { ...testExpenseTemplate.data[0] }
          testExpense2.date = testDate
          console.log({ data: [testExpense2] })
          await api
            .post(expenseURL)
            .set('Authorization', `Bearer ${testToken}`)
            .send({ data: [testExpense2] })
            console.log("Sent")
          const response = await api
            .get(expenseURL + `?year=${currentYear}`)
            .set('Authorization', `Bearer ${testToken}`)
          expect(response).to.have.status(200)
          let responseExpenses = response.body.data
          responseExpenses.forEach((value) => {
            expect(new Date(value.date).getFullYear()).to.equal(currentYear)
          })
        })
  */
      it('Should return empty data array when no expenses found', async () => {
        //There "shouldn't" be any expenses for the year 1
        const response = await api
          .get(expenseURL + '?year=1')
          .set('Authorization', `Bearer ${testToken}`)
        expect(response).to.have.status(200)
        expect(response.body.data).to.equal([])
      })

      it('Should return 400 when query is not valid', async () => {
        const response = await api
          .get(expenseURL + '?year=NotAnumber')
          .set('Authorization', `Bearer ${testToken}`)
        expect(response).to.have.status(400)
        expect(response.body.error).to.exist()
      })
    })
  })
  describe('Expenses: POST /api/v1/expenses', () => {
    //Initiate a test expense

    before(async () => {
      await models.sequelize.sync({ force: true })
      // await Expense.destroy({
      //   where: {},
      //   truncate: true,
      //   cascade: true
      // })
      // await User.destroy({
      //   where: {},
      //   truncate: true,
      //   cascade: true
      // })
      await generateRandomUsers(randomUserAmount)
      let testUser = await User.findOne({})
      testExpenseTemplate.data[0].payee = {
        id: testUser.id,
        username: testUser.username
      }
    })

    beforeEach(async () => {
      // No need to clear anything else than expenses between tests
      await Expense.destroy({
        where: {}
      })
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.post(expenseURL).send(testExpenseTemplate)
        expect(response).to.have.status(401)
        expect(response.body.data).to.equal(undefined)
        const expensesInDB = await Expense.findAll({})
        expect(expensesInDB).to.have.length(0)
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .post(expenseURL)
          .set('Authorization', 'Bearer notARealToken')
          .send(testExpenseTemplate)
        expect(response).to.have.status(401)
        expect(response.body.data).to.equal(undefined)
        const expensesInDB = await Expense.findAll({})
        expect(expensesInDB).to.have.length(0)
      })
    })

    it('Should return 400 when request body is not valid', async () => {
      const response = await api
        .post(expenseURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          notRealField: 2
        })
      expect(response).to.have.status(400)
      expect(response.body.error).to.exist()
      const expensesInDB = await Expense.findAll({})
      expect(expensesInDB).to.have.length(0)
    })
    it('Should add a new expense, when a single expense is provided', async () => {
      const response = await api
        .post(expenseURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send(testExpenseTemplate)
      const expensesInDB = await Expense.findAll({})
      expect(response).to.have.status(201)
      expect(expensesInDB).to.have.length(1)
      expect(expensesInDB[0].title).to.be.equal(
        testExpenseTemplate.data[0].title
      )
    })
    it('Should return the added expense', async () => {
      const response = await api
        .post(expenseURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send(testExpenseTemplate)
      expect(response).to.have.status(201)
      expect(response.body.data).to.be.an('Array')
      response.body.data.forEach((expense) => {
        expect(expense).to.have.all.keys(
          'id',
          'createdAt',
          'updatedAt',
          'title',
          'description',
          'amount',
          'date',
          'payee',
          'tags'
        )
        expect(expense.payee).to.not.have.any.keys('salt', 'passwordHash')
      })
    })

    it('Should add multiple new expenses, when multiple expenses are provided', async () => {
      const testExpense2 = { ...testExpenseTemplate.data[0] }
      testExpense2.title = 'TitleIsChanged'
      const copyTemplate = { ...testExpenseTemplate }
      copyTemplate.data.push(testExpense2)
      const response = await api
        .post(expenseURL)
        .set('Authorization', `Bearer ${testToken}`)
        //TODO: Might need to send in a different format
        .send(copyTemplate)
      const expensesInDB = await Expense.findAll({})
      expect(response).to.have.status(201)
      expect(expensesInDB).to.have.length(2)
      expect(response.body.data).to.have.length(2)
      expect(response.body.data[0].title).to.equal(
        testExpenseTemplate.data[0].title
      )
      expect(response.body.data[1].title).to.equal(
        testExpenseTemplate.data[1].title
      )
    })
  })
  describe('Expenses: GET /api/v1/expenses/{id}', () => {
    let testExpense
    let singleExpenseURL
    before(async () => {
      await Expense.destroy({
        where: {}
      })

      await generateRandomExpenses(randomExpenseAmount)
      testExpense = await Expense.findOne()
      singleExpenseURL = expenseURL + `/${testExpense.id}`
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.get(singleExpenseURL)
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .get(singleExpenseURL)
          .set('Authorization', 'Bearer notARealToken')
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
    })
    it('Should respond with 404 when ID is wrong', async () => {
      const response = await api
        .get(singleExpenseURL + 'somethingExtra')
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(404)
      expect(response.body.error).to.exist()
    })
    it('Should respond with 200', async () => {
      const response = await api
        .get(singleExpenseURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(200)
    })
    it('Should return the correct expense', async () => {
      const response = await api
        .get(singleExpenseURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(200)
      expect(response.body.data.id).to.equal(testExpenseID)
      expect(response.body.data).to.have.all.keys(
        'id',
        'createdAt',
        'updatedAt',
        'title',
        'description',
        'amount',
        'date',
        'payee',
        'tags'
      )
      expect(response.body.data.payee).to.not.have.any.keys(
        'salt',
        'passwordHash'
      )
    })
  })
  describe('Expenses: PUT /api/expenses/{id}', () => {
    let testExpense
    let modifiedTestExpense

    let singleExpenseURL
    before(async () => {
      await models.sequelize.sync({ force: true })
      await generateRandomUsers(randomUserAmount)
      let userFromDb = await User.findOne()
      modifiedTestExpense = { ...testExpenseTemplate.data[0] }
      modifiedTestExpense.payee = {
        username: userFromDb.username,
        id: userFromDb.id
      }
      modifiedTestExpense.title = 'Modified'
      modifiedTestExpense.amount = 1337
    })
    beforeEach(async () => {
      // No need to clear anything else than expenses between tests
      await Expense.destroy({
        where: {}
      })
      // TODO: Change the amount of expenses generated
      // Clearing the expenses causes the ID to change, so it needs te be re-aquired
      await generateRandomExpenses(randomExpenseAmount)
      testExpense = await Expense.findOne({})
      singleExpenseURL = expenseURL + `/${testExpense.id}`
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.put(singleExpenseURL).send(testExpense)
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .put(singleExpenseURL)
          .set('Authorization', 'Bearer notARealToken')
          .send(testExpense)
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
    })
    it('Should respond with 404 when ID is wrong', async () => {
      const response = await api
        .put(singleExpenseURL + 'somethingExtra')
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(404)
      expect(response.body.error).to.exist()
    })
    it('Should respond with 200', async () => {
      const response = await api
        .put(singleExpenseURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send(modifiedTestExpense)
      expect(response).to.have.status(200)
    })
    it('Should modify the expense', async () => {
      const response = await api
        .put(singleExpenseURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send(modifiedTestExpense)
      expect(response).to.have.status(200)
      let expenseInDB = await Expense.findOne({
        where: { id: testExpense.id }
      })
      expect(expenseInDB.title).to.equal('Modified')
      expect(expenseInDB.amount).to.equal(1337)
    })
  })
  describe('Expenses: DELETE /api/expenses/{id}', () => {
    let testExpense
    let singleExpenseURL
    before(async () => {
      await Expense.destroy({
        where: {}
      })
    })
    beforeEach(async () => {
      // No need to clear anything else than expenses between tests
      await Expense.destroy({
        where: {}
      })
      // TODO: Change the amount of expenses generated
      // In theory, it is enough to test with a singe expense when deleting
      await generateRandomExpenses(randomExpenseAmount)
      testExpense = await Expense.findOne({})
      singleExpenseURL = expenseURL + `/${testExpense.id}`
    })

    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.delete(singleExpenseURL)
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .delete(singleExpenseURL)
          .set('Authorization', 'Bearer notARealToken')
        expect(response).to.have.status(401)
        expect(response.body.error).to.exist()
      })
    })
    it('Should respond with 404 when ID is wrong', async () => {
      const response = await api
        .delete(singleExpenseURL + 'somethingExtra')
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(404)
      expect(response.body.error).to.exist()
    })
    it('Should respond with 204', async () => {
      const response = await api
        .delete(singleExpenseURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(204)
    })
  })
})
