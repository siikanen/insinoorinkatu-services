const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../../database/models').User
const {
  UserValidationError,
  NotFoundError
} = require('../../utils/errors/userfacing')

usersRouter
  .route('/')

  .get(async (req, res) => {
    const users = await User.findAll()
    return res.json({ data: users })
  })

  .post(async (req, res) => {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password
    })
    return res.json(newUser)
  })

usersRouter
  .route('/login')

  .post(async (req, res) => {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    })

    if (
      !user ||
      typeof req.body.password !== 'string' ||
      !user.checkPassword(req.body.password)
    )
      throw new UserValidationError('Invalid username or password')

    // TODO: Change this to use proper logger
    console.log('User verification successful')

    const tokenContent = {
      username: user.username,
      id: user.id
    }
    const jwtOptions = {
      algorithm: 'HS256',
      expiresIn: '24h'
    }
    const newToken = jwt.sign(tokenContent, process.env.JWT_SECRET, jwtOptions)

    return res.json({ token: newToken })
  })

usersRouter
  .route('/:id')

  // Find user or throw before doing anything else
  .all(async (req, res, next) => {
    const user = await User.findByPk(req.params.id)
    if (!user) throw new NotFoundError('No user has given id')
    req.user = user
    next()
  })

  .get(async (req, res) => {
    return res.json({ data: req.user })
  })

  .put(async (req, res) => {
    user = req.user
    const updatedUser = await user.update(req.body, {
      fields: ['username', 'password']
    })
    // We have to call save because password field is virtual
    // and will not get saved to the db by sequelize without
    await user.save()
    return res.json({ data: updatedUser })
  })

  .delete(async (req, res) => {
    await req.user.destroy()
    return res.status(204).end()
  })

module.exports = usersRouter
