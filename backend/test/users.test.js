const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const usersURL = '/api/v1/users'
const models = require('../database/models')
const { User } = models
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { generateRandomUsers, randomUserAmount } = require('./testHelper')
let testToken = 'NotYetInitalized'
let testUser = {
  username: 'test',
  password: 'test'
}
async function getToken() {
  await generateRandomUsers(randomUserAmount)
  let loginResponse = await api.post(`${usersURL}/login`).send({
    username: 'test0',
    password: 'test'
  })

  return loginResponse.body.token
}
before(async () => {
  await models.sequelize.sync({ force: true })
  testToken = await getToken()
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
        password: 'test'
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
      })
    })
  })
  describe('User: GET /api/v1/user/{id}', async () => {
    let dbtestUser
    let singleUserURL
    before(async () => {
      await User.destroy({
        where: {}
      })

      await generateRandomUsers(randomUserAmount)
      dbtestUser = await User.findOne()
      singleUserURL = usersURL + `/${dbtestUser.id}`
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.get(singleUserURL)
        expect(response).to.have.status(401)
        expect(response.body.error).to.not.be.undefined
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .get(singleUserURL)
          .set('Authorization', 'Bearer notARealToken')
        expect(response).to.have.status(401)
        expect(response.body.error).to.not.be.undefined
      })
    })
    it('Should respond with 404 when ID is wrong', async () => {
      const response = await api
        .get(singleUserURL + 'somethingExtra')
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(404)
      expect(response.body.error).to.not.be.undefined
    })
    it('Should respond with 200', async () => {
      const response = await api
        .get(singleUserURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(200)
    })
    it('Should return the correct User', async () => {
      const response = await api
        .get(singleUserURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(200)
      expect(response.body.data.id).to.equal(dbtestUser.id)
      expect(response.body.data).to.have.all.keys('id', 'username')
    })
  })
  describe('User: POST /api/v1/users', () => {
    beforeEach(async () => {
      await User.destroy({
        where: {}
      })
      it('Should not allow two of the same usernames to exist', async () => {
        let response = await api.post(usersURL).send(testUser)
        expect(response).to.have.status(400)
        expect(response.body.error).to.not.be.undefined
        const usersInDb = await User.findAll()
        expect(usersInDb).to.have.length(0)
      })
      it('Should return 400 when request body is not valid', async () => {
        const response = await api.post(usersURL).send({
          notRealField: 2
        })
        expect(response).to.have.status(400)
        expect(response.body.error).to.not.be.undefined
        const usersInDb = await User.findAll({})
        expect(usersInDb).to.have.length(0)
      })
      it('Should add a new user', async () => {
        const response = await api.post(usersURL).send(testUser)
        expect(response).to.have.status(201)
        const usersInDb = await User.findAll({})
        expect(usersInDb).to.have.length(1)
        expect(usersInDb[0].username).to.be.equal(testUser.username)
      })
      it('Should return the added user', async () => {
        const response = await api.post(usersURL).send(testUser)
        expect(response).to.have.status(201)
        expect(response.data).to.have.all.keys('id', 'username')
        expect(response.data.username).to.equal(testUser.username)
      })
    })
  })
  describe('User: PUT /api/users/{id}', () => {
    let dbtestUser
    let singleUserURL
    let modifiedUser = {
      username: 'modfiedUsername',
      password: 'modified'
    }
    before(async () => {
      await User.destroy({
        where: {}
      })
    })
    beforeEach(async () => {
      await User.destroy({
        where: {}
      })
      await generateRandomUsers(randomUserAmount)
      dbtestUser = await User.findOne({})
      singleUserURL = usersURL + `/${dbtestUser.id}`
    })
    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.put(singleUserURL).send(modifiedUser)
        expect(response).to.have.status(401)
        expect(response.body.error).to.not.be.undefined
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .put(singleUserURL)
          .set('Authorization', 'Bearer notARealToken')
          .send(modifiedUser)
        expect(response).to.have.status(401)
        expect(response.body.error).to.not.be.undefined
      })
    })
    it('Should respond with 404 when ID is wrong', async () => {
      const response = await api
        .put(singleUserURL + 'somethingExtra')
        .set('Authorization', `Bearer ${testToken}`)
        .send(modifiedUser)
      expect(response).to.have.status(404)
      expect(response.body.error).to.not.be.undefined
    })
    it('Should respond with 200', async () => {
      const response = await api
        .put(singleUserURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send(modifiedUser)
      expect(response).to.have.status(200)
    })
    it('Should modify the User', async () => {
      const response = await api
        .put(singleUserURL)
        .set('Authorization', `Bearer ${testToken}`)
        .send(modifiedUser)
      expect(response).to.have.status(200)
      let UserInDB = await User.findOne({
        where: { id: testUser.id }
      })
      expect(UserInDB.name).to.equal(modifiedUser.username)
    })
  })
  describe('User: DELETE /api/users/{id}', () => {
    let dbtestUser
    let singleUserURL
    before(async () => {
      await User.destroy({
        where: {}
      })
    })
    beforeEach(async () => {
      // No need to clear anything else than Users between tests
      await User.destroy({
        where: {}
      })
      // TODO: Change the amount of Users generated
      // In theory, it is enough to test with a singe User when deleting
      await generateRandomUsers(randomUserAmount)
      dbtestUser = await User.findOne({})
      singleUserURL = usersURL + `/${dbtestUser.id}`
    })

    describe('Authorization tests', () => {
      it('Should respond with 401 unauthorized when Authorization header is missing', async () => {
        const response = await api.delete(singleUserURL)
        expect(response).to.have.status(401)
        expect(response.body.error).to.not.be.undefined
      })
      it('Should respond with 401 unauthorized when JWT token is incorrect', async () => {
        const response = await api
          .delete(singleUserURL)
          .set('Authorization', 'Bearer notARealToken')
        expect(response).to.have.status(401)
        expect(response.body.error).to.not.be.undefined
      })
    })
    it('Should respond with 404 when ID is wrong', async () => {
      const response = await api
        .delete(singleUserURL + 'somethingExtra')
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(404)
      expect(response.body.error).to.not.be.undefined
    })
    it('Should respond with 204', async () => {
      const response = await api
        .delete(singleUserURL)
        .set('Authorization', `Bearer ${testToken}`)
      expect(response).to.have.status(204)
    })
    it('Should delete the user', async () => {
      await api
        .delete(singleUserURL)
        .set('Authorization', `Bearer ${testToken}`)
      const usersInDb = await User.findAll()
      expect(usersInDb).to.have.length(randomUserAmount - 1)
      const deletedUser = await User.findOne({
        where: {
          id: dbtestUser.id
        }
      })
      expect(deletedUser).to.be(null)
    })
  })
  describe('Login POST /api/v1/users/login', async () => {
    let loginURL = usersURL + '/login'
    let UserInDB
    before(async () => {
      await User.destroy({
        where: {}
      })
      // random users have password 'test'
      await generateRandomUsers(1)
      UserInDB = await User.findOne()
    })
    it('Should not allow to login with wrong password', async () => {
      const response = await api.post(loginURL).send({
        username: UserInDB.username,
        password: 'WRONG PASSWORD'
      })
      expect(response).to.have.status(401)
      expect(response.body.error).to.not.be.undefined
    })
    it('Should return token when correct credentials are provided', async () => {
      const response = await api.post(loginURL).send({
        username: UserInDB.username,
        password: 'test'
      })
      expect(response).to.have.status(200)
      expect(response.body.token).to.be.a('String')
    })
  })
})
