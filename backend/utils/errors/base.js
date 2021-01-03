'use strict'

// Here is the base error classes to extend from

class ApplicationError extends Error {
  get name() {
    return this.constructor.name
  }
  get statusCode() {
    return 500
  }
  constructor(message, options = {}) {
    super(message)

    // Attach information about the incident, path, user etc.
    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }
}

class DatabaseError extends ApplicationError {}

class UserFacingError extends ApplicationError {}

module.exports = {
  ApplicationError,
  DatabaseError,
  UserFacingError,
}
