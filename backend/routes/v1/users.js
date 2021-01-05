const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const models = require('../../database/models')
const { UserValidationError } = require('../../utils/errors/userfacing')

const User = models.User

usersRouter
  .route('/')

  .get(async (req, res) => {
    const users = await User.findAll()
    return res.json({ data: users })
  })

  .post(async (req, res) => {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    })
    return res.json(newUser)
  })

usersRouter
  .route('/login')

  .post(async (req, res) => {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    })

    if (
      !user ||
      typeof req.body.password !== "string" ||
      !user.checkPassword(req.body.password)
    )
      throw new UserValidationError('Invalid username or password')

    // TODO: Change this to use proper logger
    console.log('User verification successful')

    const tokenContent = {
      username: user.username,
      id: user.id,
    }
    const jwtOptions = {
      algorithm: 'HS256',
      expiresIn: '24h',
    }
    const newToken = jwt.sign(tokenContent, process.env.JWT_SECRET, jwtOptions)

    return res.json({ token: newToken })
  })

module.exports = usersRouter
