const usersRouter = require('express').Router()

const userController = require('../../controllers/user')

usersRouter
  .route('/')
  .get(userController.index)
  .post(userController.createUser)

usersRouter
  .route('/login')
  .post(userController.userLogin)

usersRouter
  .route('/:id')

  // Find user or throw before doing anything else
  .all(userController.beforeAllId)

  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = usersRouter
