const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const usersURL = '/api/v1/users'
const models = require('../database/models')
const { User} = models
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const {generateRandomUsers,randomUserAmount } = require('./testHelper')
let testToken = 'NotYetInitalized'
async function getToken() {
  console.log(randomUserAmount)
  await generateRandomUsers(randomUserAmount)
  let loginResponse = await api.post(`${usersURL}/login`).send({
    username: 'test0',
    password: 'test',
  })

  return loginResponse.body.token
}
before(async () => {
  await models.sequelize.sync({ force: true })
  testToken=await getToken()
})
describe('Users', () => {
  before(async () => {
    await models.sequelize.sync({ force: true })
  })
  describe('User: GET /api/v1/users', () => {
    before(async () => {
      await generateRandomUsers(2)
      let loginResponse = await api.post(`${usersURL}/login`).send({
        username: 'test0',
        password: 'test',
      })
      testToken = loginResponse.body.token
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.get(usersURL)
        expect(response).to.have.status(401)
        expect(response.body.data).to.equal(undefined)
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .get(usersURL)
          .set('Authorization', 'Bearer notARealToken')
        expect(response).to.have.status(401)
        expect(response.body.data).to.equal(undefined)
      })
    })
    it('Should return all the users', async () => {
      const response = await api
        .get(usersURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(200)
      expect(response.body.data).to.be.an('Array')
      expect(response.body.data).to.have.length(randomUserAmount)
      response.body.data.forEach((user) => {
        expect(user).to.have.all.keys(
          'id',
          'username',
          'createdAt',
          'updatedAt'
        )
        expect(user).to.not.have.any.keys('salt', 'passwordHash')
      })
    })
  })
  describe('User: POST /api/v1/users', () => {
    beforeEach(async () => {
      await User.destroy({
        where: {},
      })
    })
  })
})
