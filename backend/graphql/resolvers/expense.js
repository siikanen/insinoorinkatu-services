const { Expense } = require('../../database/models')
const { NotFoundError } = require('../../utils/errors/userfacing')

const expenseResolvers = {

  Query: {
    getExpenses: async (_, args) => {
      if (!args.id) {
        const { skip, limit, month, year } = args
        const query = {}
        if (month || year) {
          // (month, !year) => select current year,
          // (!month, year) => select that month this year
          // (month, year) => select that month, that year
          const dateStart = new Date(
            year || new Date().getFullYear(),
            month - 1 || 0
          )
          const dateEnd = new Date(dateStart)
          if (month) dateEnd.setMonth(dateStart.getMonth() + 1)
          else dateEnd.setFullYear(dateStart.getFullYear() + 1)

          query['date'] = {
            [Op.gt]: dateStart,
            [Op.lt]: dateEnd
          }
        }
        return await Expense.findAll({
          where: query,
          limit: limit || 50,
          offset: skip || 0,
          order: [['date', 'DESC']],
          rejectOnEmpty: new NotFoundError('Expense not found')
        })
      }
      return [
        await Expense.findByPk(args.id, {
          rejectOnEmpty: new NotFoundError('Expense not found')
        })
      ]
    }
  }
}
module.exports = expenseResolvers
