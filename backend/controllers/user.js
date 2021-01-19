const { Op } = require('sequelize')

const { User } = require('../database/models')
const {
  UserValidationError,
  NotFoundError
} = require('../utils/errors/userfacing')

/** GET /users
 * Get all userdata
 * @param res {Object} - as format {data: [...users]}
 */
exports.index = async (_req, res) => {
  const users = await User.findAll()
  res.json({ data: users })
}

/** POST /users
 * Create new user
 * @param req.body {Object} - New user to create
 *  For example { username: "hansolo", password: "chewbacca" }
 * @param res {Object} - New user with all fields and token
 *  For example {
 *                data: {...user},
 *                token: "aGFuc29sb2hhbnNvbG8K..."
 *              }
 */
exports.createUser = async (req, res) => {
  const newUser = await User.create(req.body, {
    fields: ['username', 'password']
  })
  // TODO: Add token to response object
  res.json({ data: newUser, token: await newUser.createToken() })
}

/** POST /users/login
 * Login with user and return JWT token
 * @param req.body {Object} - User to login with
 *  For example { username: "hansolo", password: "chewbacca" }
 * @param res {Object} - JWT token to authenticate with
 *  For example { token: "aGFuc29sb2hhbnNvbG8K..." }
 */
exports.userLogin = async (req, res) => {
  // User can log in with either username or user UUID
  const user = await User.findOne(
    {
      where: {
        [Op.or]: [
          { username: req.body.username || null },
          { id: req.body.id || null }
        ]
      }
    },
    { fields: ['username', 'id'] }
  )
  if (
    !user ||
    typeof req.body.password !== 'string' ||
    !(await user.checkPassword(req.body.password))
  )
    throw new UserValidationError('Invalid username or password')

  // TODO: Change this to use proper logger
  console.log('User verification successful')

  res.json({ token: await user.createToken() })
}

/**
 * Helper function to add User model to req object since all
 * later handlers require it
 *
 * This function funs before any other handlers at /users/:id
 */
exports.beforeAllId = async (req, _res, next) => {
  const user = await User.findByPk(req.params.id, {
    rejectOnEmpty: new NotFoundError('User not found')
  })
  req.user = user
  next()
}

/** GET /users/:id
 * Return all data about single user with given id
 * @param req.user {User} - User model to return
 * @param res {Object} - Data of the user as { data: {...user} }
 */
exports.getUser = async (req, res) => {
  res.json({ data: req.user })
}

/** PUT /users/:id
 * Update given users fields
 * @param req.user {User} - User model to update
 * @param res {Object} - Data of the modified user
 *  as { data: {...user} }
 */
exports.updateUser = async (req, res) => {
  user = req.user
  const updatedUser = await user.update(req.body, {
    fields: ['username', 'password']
  })
  // We have to call save because password field is virtual
  // and will not get saved to the db by sequelize without
  await user.save()
  res.json({ data: updatedUser })
}

/** DELETE /users/:id
 * Delete given user
 * @param req.user {User} - User model to delete
 */
exports.deleteUser = async (req, res) => {
  await req.user.destroy()
  res.status(204).end()
}
