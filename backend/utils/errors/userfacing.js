'use strict'
const { UserFacingError } = require('./base')

class BadRequestError extends UserFacingError {
  get statusCode() {
    return 400
  }
}

class NotFoundError extends UserFacingError {
  get statusCode() {
    return 404
  }
}

class UserValidationError extends UserFacingError {
  get statusCode() {
    return 401
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  UserValidationError,
}
