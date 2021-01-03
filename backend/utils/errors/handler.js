const { ApplicationError } = require('./base')

module.exports = async (err, req, res, next) => {
  switch (err.name) {
    case 'ApplicationError':
      res.status(err.statusCode).send()
      break;
    case 'SyntaxError': {
      res.status(400).json({
        error: {
          message: 'Invalid syntax',
        },
      })
      break
    }
    case 'SequelizeUniqueConstraintError': {
      res.status(400).json({
        error: {
          message: err.errors.map(e => e.message).join(", ")
        },
      })
    }
    default:
      break
  }

  // TODO: Change this to use the main logger when it exists
  console.error("ERROR: ", err)
  next(err)
}
