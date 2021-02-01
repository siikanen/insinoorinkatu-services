const { User } = require('../../database/models')
const { NotFoundError } = require('../../utils/errors/userfacing')

exports.userResolvers = {
  Query: {
    getUsers: async (_, args) => {
      if (!args.id) {
        return await User.findAll()
      }
      return await User.findByPk(args.id, {
        rejectOnEmpty: new NotFoundError('User not found!')
      })
    }
  }
}
